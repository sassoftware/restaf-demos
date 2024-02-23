/*
* Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/
/**
 * @async
 * @function setupAssist
 * @description   Setup the GPT Assistant
 * @param {string} apiKey - openai api key
 * @param {string} assistanceName - name of the assistant(default is SAS_Assistant)
 * @returns {promise} - return {openai, assistant, thread, functionList}
 */
async function createAssistant(openai, name, instructions, threadReuse, tools) {

let thread = await openai.beta.threads.create({
  metadata: {assistanceName: name}}
);
let m = process.env.OPENAI_MODEL;
let createArgs = {
  name: name,
  instructions: instructions,
  model: (m == null || m.trim().length === 0 ) ? 'gpt-4-turbo-preview' : m,
  tools: tools,
  metadata:{ thread_id: thread.id, lastRunId: '0'},
};

let assistant = await openai.beta.assistants.create(createArgs);
console.log('-----------------------------------');
console.log('New Assistant: ', name, assistant.id);
console.log('New Thread: ', thread.id);
console.log('-----------------------------------');

return {openai, assistant, thread};
}
export default createAssistant;