/*
 * Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @async
 * @function setupAssistant
 * @description   Setup the GPT Assistant
 * @param {object} config - configuration object
 * @returns {promise} - return gptControl object}
 */
import OpenAI from 'openai';
import loadThread from './loadThread.js';
import createAssistant from './createAssistant.js';

async function setupAssistant(config) {
  let {credentials } = config;
  let {key} = credentials;
  debugger;
  let client = new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true });
  debugger;
  let gptControl = {
    provider: 'openai',
    client: client,
    assistant: null,
    thread: null,
    threadid: null,
    specs: config.domainTools,
    appEnv: null,
    config: config, // save the config for runtime changes
  };
  // create assistant and thread
  debugger;
  gptControl.assistant = await createAssistant(client, config);
  debugger;
  gptControl.thread = await loadThread(client, config);
  debugger;
  gptControl.threadid = gptControl.thread.id;// just for convenience
  return gptControl;
}
export default setupAssistant;
