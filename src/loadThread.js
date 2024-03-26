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
  let lastThread = assistant.metadata.lastThread;

  // a little verbose so as not to get confused :-)

  try {

    // user has supplied a threadid, use it
    if (!(threadid === 'REUSE' || threadid === 'NEW')) { 
      console.log('Using threadid ', threadid);
      let thread = await assistantApi.getThread(threadid);
      return thread;
      //Q: should we recover on a 404 and create a new thread?
    }
   

    // local rules: try to use the last used thread if the
    // assistant has lastThread in the metadata  
    if (threadid === 'REUSE' && lastThread != null) {
      console.log('Attempting to use previous ', lastThread);
      let thread = await assistantApi.getThread(lastThread);
      return thread;
    }

  // fall thru  to create a new thread

  // more local rules: if lastThread is not null delete it
  if (lastThread != null) {
    console.log('Deleting last thread', lastThread);
    await assistantApi.deleteThread(lastThread);
  }

  // create a new thread with no history
  console.log('Creating new thread');
  thread = await assistantApi.createThread();
  return thread;

  } catch (error) {
    console.log(error); 
    throw new Error(`Error status ${error.status}. Failed to create thread. See console for details.`);
  }
  

  // local rules: save the thread id in the assistant metadata
  
 
  return thread;
}
export default loadThread;
