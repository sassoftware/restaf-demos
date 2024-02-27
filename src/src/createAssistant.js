/*
* Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/

import loadThread from "./loadThread.js";

/**
 * @async
 * @function setupAssist
 * @description   Setup the GPT Assistant
 * @param {string} apiKey - openai api key
 * @param {object} config - configuration object
 * @returns {promise} - return {openai, assistant, thread, functionList}
 */
async function createAssistant(openai, config) {
let {assistantName, instructions, model, specs, reuseThread} = config;

let createArgs = {
  name: assistantName,
  instructions: instructions,
  model: model, 
  tools: specs.tools,
  metadata:{ thread_id: '0', lastRunId: '0'},
};

let assistant = await openai.beta.assistants.create(createArgs);
console.log('-----------------------------------');
console.log('New Assistant: ', assistantName , assistant.id);
let r = await loadThread(openai, config.threadid, assistant, reuseThread);
console.log('Thread ID: ', r.thread.id);
console.log('-----------------------------------');
// assistant might have been updated in loadThread
let gptControl = {
  openai,
  assistant: r.assistant, 
  thread: r.thread,
  threadid: r.thread.id,
 specs};
return gptControl;
}
export default createAssistant;