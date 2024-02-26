/*
 * Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @async
 * @function openAssistant
 * @description   Reuse existing assistant
 * @param {string} apiKey - openai api key
 * @param {string} assistant - assistant object
 * @param {object} config - configuration object
 * @returns {promise} - return {openai, assistant, thread, functionList}
 */
import loadThread from './loadThread.js'; 
async function openAssistant(openai, assistant, config) {

  let {reuseThread} = config;
  console.log("Using Existing Assistant: ", assistant.name, assistant.id);
  let thread_id = assistant.metadata.thread_id;
  console.log("Associated thread_id: ", thread_id);

  // load previous thread. loadThread will create a new thread if reuseThread is false
  let r = await loadThread(openai, assistant, reuseThread);
  // assistant might have been updated in loadThread
  let gptControl = {
    openai: openai,
    assistant: r.assistant,
    thread: r.thread,
    specs: config.specs
  };
  return gptControl;
}
export default openAssistant;