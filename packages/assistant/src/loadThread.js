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
async function loadThread(openai, threadid, assistant, reuseThread) {
 // let thread_id = assistant.metadata.thread_id;

  let thread = null;
  // If we are reusing the thread, try to retrieve it
  if (reuseThread === true && threadid != '0') {
    try {
      thread = await openai.beta.threads.retrieve(threadid);
    } catch (error) {
      console.log(error); 
      console.log(error.status);
      console.log(`Error status ${error.status}. Unable to retrieve the thread ${thread_id}`);
    }
  }

  // If still no thread, create a new one
  if (thread == null) {
    console.log('Creating new thread' );
    thread = await openai.beta.threads.create({
      metadata: { assistanceName: assistant.name },
    });
    // update assistant metadata
    assistant = await openai.beta.assistants.update(assistant.id, {
      metadata: { thread_id: thread.id, lastRunId: "0" },
    });
  }

  return { thread, assistant };
}
export default loadThread;
