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
import { OpenAIClient, OpenAIKeyCredential } from '@azure/openai';
import loadThread from './loadThread.js';
import createAssistant from './createAssistant.js';

async function setupAssistant(config) {
  let { provider, credentials } = config;
  let {openaiKey, azureaiKey, azureaiEndpoint} = credentials;
  // let apiKey = (provider === 'openai') ? process.env.OPENAI_KEY : process.env.OPENAI_AZ_KEY;

  //
  debugger;
  let client = null;
  if (provider === 'openai') {
    if (openaiKey == null) {
      throw new Error('Missing OpenAI API Key');
    }
    client = new OpenAI({ apiKey: openaiKey, dangerouslyAllowBrowser: true });

  } else if (provider === 'azureai') {
    if (azureaiKey == null) {
      throw new Error('Missing Azure API Key');
    }
    if (azureaiEndpoint == null) {
      throw new Error('Missing Azure Endpoint');
    }
    client = new OpenAIClient(endpoint, new OpenAIKeyCredential(azureaiKey));
    debugger;
    console.log(Object.keys(client));
  } else {
    throw new Error('Invalid provider. Must be openai or azureai.');
  }

  debugger;
  let gptControl = {
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
