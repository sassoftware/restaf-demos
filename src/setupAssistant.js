/*
 * Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import OpenAI from 'openai';
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
  let {key} = credentials;

  // create the client
  debugger;
  let client = new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true });
  debugger;

  //
  // now add user specs and functions.
  // In pass 1 the user list is prepended to the default list

  let builtinTools = functionSpecs();
  let userTools = config.domainTools.tools.concat(builtinTools.tools);
  let userFunctions = Object.assign(config.domainTools.functionList, builtinTools.functionList);
  let userInstructions = (config.instructions)  ? config.instructions + builtinTools.instructions : builtinTools.instructions;
  let specs = {tools: userTools, functionList: userFunctions};
  let gptControl = {
    provider: config.provider,
    model: config.model,
    domainSpecs: specs,
    instructions: userInstructions,

    assistantName: config.assistantName,
    assistant: null,
    assistantid: config.assistantid,

    thread: null,
    threadid: config.threadid,

    appEnv: null,
    client: client,
    run: null,
    assistantApi: apiMapper(client, config.provider)
    //config: config save the config for runtime changes
  };
  if (gptControl.a)
  console.log(gptControl)
  
  // setup Viya connections
  gptControl.appEnv = await setupViya(config.viyaConfig);
  
  // create assistant and thread
  debugger;
  gptControl.assistant = await createAssistant(gptControl);
  debugger;
  gptControl.thread = await loadThread(gptControl);
  debugger;
  gptControl.threadid = gptControl.thread.id;// just for convenience
  return gptControl;
}
export default setupAssistant;
