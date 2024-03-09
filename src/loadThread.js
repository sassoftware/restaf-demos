/*
 * Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @async
 * @private
 * @function loadThread
 * @description   new thread or open existing thread
 * @param {object} gptControl - gptControl object
 * @returns {promise} - return thread object
 */
async function loadThread(gptControl) {
  let {threadid, assistantApi} = gptControl;
  let thread = null;
  // If we are reusing the thread, try to retrieve it

  console.log('threadid', threadid);
  try {
    thread = (threadid === '0' || threadid == null) 
      ? await assistantApi.createThread()
      : await assistantApi.getThread(threadid);
  } catch (error) {
    console.log(error); 
    console.log(error.status);
    throw new Error(`Error status ${error.status}. Unable to retrieve the thread ${threadid}. see console for details.`);
  }
  debugger;
  return thread;
}
export default loadThread;
