/*
 * Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import OpenAI from 'openai';

import { AssistantsClient, AzureKeyCredential } from "@azure/openai-assistants";
import loadThread from './loadThread.js';
import createAssistant from './createAssistant.js';
//import functionSpecs from './builtins/tools/functionSpecs.js';
import setupViya from './builtins/tools/lib/setupViya.js';
import apiMapper from './apiMapper.js';
//import functionSpecs from "./functionSpecs.js";
//import functions from "./functions.js";
//import instructions from "./instructions.js";
import defaultTools from "./builtins/tools/index.js";

/**
 * @async
 * @function setupAssistant
 * @description   Setup the assistant
 * @param {config} config - configuration object
 * @returns {promise} - return gptControl object}
 * @example
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

  let specs;
  if (config.domainTools.replace === true) {
    specs = config.domainTools;
    //dtools = specs.tools;
  } else {
    let toolset =(config.toolSet) ? config.toolSet : 'viya';
    let functionSpecs = defaultTools[toolset]; 
    console.log('toolset', toolset, functionSpecs );
    let builtinTools =  functionSpecs(config.env, false,false);
    let dtools = [];
    let incoming = config.domainTools.tools
    // allow users to override the default tool by naming their tool the same as the default tool
    dtools = builtinTools.tools.filter((t) => {
      let f = incoming.findIndex((fe,i) => fe.function.name === t.function.name)
      if (f !== -1) {
        console.log('overriding', t.function.name);
      }
      return (f === -1) ? true : false;
    })
   //  let userTools = config.domainTools.tools.concat(builtinTools.tools);
    let userTools = dtools.concat(incoming);
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
    toolset: config.toolset,
    code: config.code, 
    retrieval: config.retrieval, // remove this when azureai supports retrieval
    userData: config.userData,
    user: config.user,
    useResultFile: config.useResultFile
  };
  
  // setup Viya connections
  debugger;
  gptControl.appEnv = await setupViya(config.viyaConfig);
  gptControl.appEnv.userData = config.userData;
  gptControl.appEnv.user = config.user;
  
  // create assistant or reuse existing one
  
  gptControl.assistant = await createAssistant(gptControl);
  
  // load thread or reuse existing one
  /*
  gptControl.thread = await loadThread(gptControl);
  let metadata = gptControl.assistant.metadata;
  metadata.lastThread = gptControl.thread.id;
  let newAssistant = await gptControl.assistantApi.updateAssistant(gptControl.assistant.id, {metadata: metadata});
  gptControl.assistant = newAssistant;
  
  gptControl.threadid = gptControl.thread.id;// just for convenience
  */
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
