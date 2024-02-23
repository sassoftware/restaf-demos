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
 * @returns {promise} - return {openai, assistant, thread, functionList}
 */
import loadThread from './loadThread.js'; 
async function openAssistant(openai, assistant, instructions, threadReuse, tools) {
  // assistant exists
  console.log("Using Existing Assistant: ", assistant.name, assistant.id);
  let thread_id = assistant.metadata.thread_id;
  console.log("Associated thread_id: ", thread_id);

  let r = await loadThread(openai, assistant, threadReuse);
  // assistant might have been updated in loadThread
  assistant = r.assistant;
  let thread = r.thread;
  
  return { openai, assistant, thread };
}
export default openAssistant;