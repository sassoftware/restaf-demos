/*
 * Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @async
 * @function openAssistant
 * @description   Reuse existing assistant
 * @param {string} apiKey - client api key
 * @param {string} assistant - assistant object
 * @param {object} config - configuration object
 * @returns {promise} - return {client, assistant, thread, threadid, function specs}
 */
import loadThread from './loadThread.js'; 
async function openAssistant(client, assistant, config) {

  let gptControl = {
    client: client,
    assistant: assistant,
    thread: null,
    threadid: null,
    specs: config.specs
  };
  return gptControl;
}
export default openAssistant;
