/*
 * Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @async
 * @private
 * @function loadThread
 * @description   new thread or open existing thread
 * @param {gptControl} gptControl - gptControl object
 * @returns {promise} - return thread object
 */
async function loadThread(gptControl) {
  let {assistant, assistantApi} = gptControl;
  let thread = null;
  let threadid = gptControl.threadid;

  // a little verbose so as not to get confused :-)

  try {
    // local rules: try to use the last used thread
    
    // if threadid is specified, use it

    if (!(threadid === '0' || threadid === '-1')) {
      console.log('Using threadid ', threadid);
      thread = await assistantApi.getThread(threadid);
      return thread;
    }

    if (threadid === '-1' ){ 
      threadid = assistant.metadata.lastThread;
      if (threadid != null)  {
        console.log('Attempting to use previous ', threadid);
        let thread = await assistantApi.getThread(threadid);
        return thread;
      }
    }
  // fall thru  to create a new thread
  console.log('Creating new thread');
  thread = await assistantApi.createThread();
  let newAssistant = await assistantApi.updateAssistant(assistant.id, {metadata: {lastThread: thread.id}});
  gptControl.assistant = newAssistant;

  } catch (error) {
    console.log(error); 
    throw new Error(`Error status ${error.status}. Failed to create thread. See console for details.`);
  }
  

  // local rules: save the thread id in the assistant metadata
  
 
  return thread;
}
export default loadThread;
