/*
 * Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @async
 * @function loadThread
 * @description   reattach thread from previous session
 * @param {string} apiKey - openai api key
 * @param {string} assistant - assistant object
 * @returns {promise} - return {thread, assistant} 
 */
async function loadThreadx(openai, assistant) {
  let thread_id = assistant.metadata.thread_id;
  let lastRunId = assistant.metadata.lastRunId;

  // see if it exists
  let thread = null;
  try {
    thread = await openai.beta.threads.retrieve(thread_id);
  } catch (error) {
    console.log(error)
    if (error.status !== 404) {
      console.log(`Thread ${thread_id} not found. Will create a new thread`);
    }
    else if (error.status !== 400 && lastRunId !== '0') {
      try {
        let run = await openai.beta.threads.runs.cancel(thread.id, lastRunId);
        thread = await openai.beta.threads.retrieve(thread_id);
        assistant = await openai.beta.assistants.update(assistant.id, {
          metadata: { thread_id: thread.id, lastRunId: run.id }})
      } catch (error) {
        console.log('Unable to cancel the last run')
        console.log(error);
      }
    } 
    // If still no thread, create a new one
    if (thread == null) {
        console.log("Creating new thread. Your previous thread is not available.");
        thread = await openai.beta.threads.create({
          metadata: { assistanceName: assistant.name },
        });
        // update assistant metadata
        assistant = await openai.beta.assistants.update(assistant.id, {
          metadata: { thread_id: thread.id, lastRunId: '0' },
        });
    }
  }

  return { thread, assistant};
}
export default loadThreadx;