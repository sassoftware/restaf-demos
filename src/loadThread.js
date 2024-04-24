/*
 * Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @async
 * @private
 * @function loadThread
 * @description   reuse a thread or create a new thread
 * @param {gptControl} gptControl - gptControl object
 * @returns {promise} - return thread object
 */
async function loadThread(gptControl) {
  let { assistantApi, assistant, threadid, devMode} = gptControl;

  try {
    // if devMode is true, create a new thread
    if (devMode === true) {
      let thread = await assistantApi.createThread();
      await modifyAssistant(gptControl, thread);
      return thread;
    }

   // if threadid is provided, use it 
    if (threadid != null && threadid.trim().length > 0) {
      let thread = await assistantApi.getThread(threadid);
      await modifyAssistant(gptControl, thread);
      return thread;
    }

    // if lastThread is available use it
    if ( assistant.metadata.lastThread != null && assistant.metadata.lastThread.trim().length > 0) {
      console.log('Using thread from last session');
      let thread = await assistantApi.getThread(assistant.metadata.lastThread);
      await modifyAssistant(gptControl, thread);
      return thread;
    }

    // if no threadid or lastThread, create a new thread
    let thread = await assistantApi.createThread();
    await modifyAssistant(gptControl, thread);
    return thread;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to load thread ${error}`);
  }
}

async function modifyAssistant(gptControl, thread) {
  let { assistantApi, assistant } = gptControl;
  // persist information on thread in assistant metadata
  let metadata = assistant.metadata;
  metadata.lastThread = thread.id;
  let options = {
    metadata: metadata,
  };
  let newAssistant = await assistantApi.updateAssistant(assistant.id, options);
  gptControl.assistant = newAssistant;
  gptControl.assistantid = newAssistant.id;
  gptControl.thread = thread;
  gptControl.threadid = thread.id;
  return newAssistant;
}

export default loadThread;
