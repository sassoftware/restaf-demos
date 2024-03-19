/*
 * Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import OpenAI from 'openai';

import { AssistantsClient, AzureKeyCredential } from "@azure/openai-assistants";
import loadThread from './loadThread.js';
import createAssistant from './createAssistant.js';
import functionSpecs from './builtins/functionSpecs.js';
import setupViya from './builtins/lib/setupViya.js';
import apiMapper from './apiMapper.js';

/**
 * @async
 * @function setupAssistant
 * @description   Setup the assistant
 * @param {config} config - configuration object
 * @returns {promise} - return gptControl object}
 * @example
 *  Local rules:
 *  To avoid creating lots of assistants and threads during
 * development, you can use the same assistant and thread.
 * 
 * Assistant:
 *   If assistantid is known set it as assistantid. else set it as '0'
 *  If assistantid is '0' then the assistantName is used to find the assistant.
 * If assistantName is not found, a new assistant is created using the same name
 *   
 * Threads:
 *  When a thread is created for an Assistant, the threadid is stored in the assistant metadata.  
 *  So on the next setupAssistant call - if either assistantid or assistantName is specified
 *  the threadid is retrieved from the assistant metadata.
 * 
 * These local rules are probably not ideal, but helps during development.
 * 
 *  A sample configuration object is shown below
 * let config = {
    provider: 'azureai', // Depending on who your account is with
    model: process.env.AZUREAI_MODEL,// model name
    credentials: {
      key: process.env.AZUREAI_KEY, // obtain from provider
      endPoint: process.env.AZUREAI_ENDPOINT // obtain from provider
    },
    assistantid: '0', //Replace with valid assistant id or 0 for new assistant
                 
    assistantName: "SAS_ASSISTANT", //if assistantid is 0, then either an exting id with that name will be used or a new assistant will be created
    threadid: '-1', // some valid threadid or 0 for new thread or-1 for existing thread stored in Assistant metadata
    domainTools: {tools: [], functionList: {}, instructions: '', replace: false},

    // fill in the host and token to authenticate to Viya
    // set the source to cas or compute. 
    // if you want to run the AI assistant without Viya set source to none
    viyaConfig: {
      logonPayload: {
        authType: 'server',
        host: host,  // viya url - https://myviyaserver.acme.com
        token: token,// viya token  - obtained from sas-viya auth login|loginCode
        tokenType: 'bearer'  
        },
      source: 'cas' 
    },
    code: true,
    retrieval: false
}
 * 
 * 
 */

async function setupAssistant(config) {
  let {credentials } = config;
  let {key, endPoint} = credentials;
  // create the client
  
  let client = null;
  if (config.provider === 'openai') {
     client = new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true });
  } else {
    client = new AssistantsClient(endPoint, new AzureKeyCredential(key, {}));
  }

  //
  // now add user specs and functions.
  // In pass 1 the user list is prepended to the default list

  let builtinTools = functionSpecs(config.provider, false,false);
  let specs={};
  if (config.domainTools.replace === true) {
    specs = config.domainTools;
  } else {
    let userTools = config.domainTools.tools.concat(builtinTools.tools);
    // let userFunctions = Object.assign(config.domainTools.functionList, builtinTools.functionList);
    let userFunctions = Object.assign(builtinTools.functionList, config.domainTools.functionList);
    let userInstructions = (config.instructions)  ? config.instructions + builtinTools.instructions : builtinTools.instructions;
    specs = {tools: userTools, functionList: userFunctions, instructions: userInstructions};
  }
  //moved this here to handle user override of all builtin tools

  if (config.code) {
    specs.tools.push({ type: 'code_interpreter' });
  }
  if (config.retrieval) {
    specs.tools.push({ type: 'retrieval' });
  }
  let gptControl = {
    provider: config.provider,
    model: config.model,
    domainTools: specs,
    instructions: specs.instructions,

    assistantName: config.assistantName,
    assistant: null,
    assistantid: config.assistantid,

    thread: null,
    threadid: config.threadid,

    appEnv: null,
    client: client,
    run: null,
    assistantApi: apiMapper(client, config.provider),
    code: config.code, 
    retrieval: config.retrieval, // remove this when azureai supports retrieval
    userData: config.userData,
    user: config.user
  };
  
  // setup Viya connections
  gptControl.appEnv = await setupViya(config.viyaConfig);
  gptControl.appEnv.userData = config.userData;
  gptControl.appEnv.user = config.user;
  
  // create assistant or reuse existing one
  
  gptControl.assistant = await createAssistant(gptControl);
  
  // load thread or reuse existing one
  gptControl.thread = await loadThread(gptControl);
  let newAssistant = await gptControl.assistantApi.updateAssistant(gptControl.assistant.id, {metadata: {lastThread: gptControl.thread.id}});
  gptControl.assistant = newAssistant;
  
  gptControl.threadid = gptControl.thread.id;// just for convenience
  console.log('--------------------------------------');
  console.log('Current session:');
  console.log('Provider: ', gptControl.provider);
  console.log('Model: ', gptControl.model);
  console.log(
    'Assistant: ',
    gptControl.assistant.name,
    'Assistant id',
    gptControl.assistant.id
  );
  console.log('Threadid: ', gptControl.thread.id);
  console.log('Viya Source:', gptControl.appEnv.source);
  console.log('--------------------------------------');
  return gptControl;
}
export default setupAssistant;
