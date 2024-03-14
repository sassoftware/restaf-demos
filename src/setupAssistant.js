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
    let userFunctions = Object.assign(config.domainTools.functionList, builtinTools.functionList);
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
    instructions: specs.userInstructions,

    assistantName: config.assistantName,
    assistant: null,
    assistantid: config.assistantid,

    thread: null,
    threadid: config.threadid,

    appEnv: null,
    client: client,
    run: null,
    assistantApi: apiMapper(client, config.provider),
    retrieval: config.retrieval // remove this when azureai supports retrieval
    //config: config save the config for runtime changes
  };
  
  // setup Viya connections
  
  gptControl.appEnv = await setupViya(config.viyaConfig);
  
  // create assistant and thread
  
  gptControl.assistant = await createAssistant(gptControl);
  
  gptControl.thread = await loadThread(gptControl);
  
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
