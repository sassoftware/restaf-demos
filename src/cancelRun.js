/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @async
 * @private
 * @description - Cancel a previous run (on user request)
 * @function cancelRun
 * @param {appControl} appControl - gpt  session control object
 * @param {string} [threadid] - thread id
 * @param {string} [runid] - run id
 * returns {promise} - status (null if no run or thread or failed to cancel)
 * @example - This function will cancel the run
 */

async function cancelRun(appControl, threadid, runid) {
  let {assistantApi, assistant, thread, run} = appControl;  

  if (threadid != null && runid != null) {
    try {
      console.log('Cancelling run', threadid, runid);
      let status = await assistantApi.cancelRun(threadid, runid);
      return status;
    } catch (error) {
      throw "Error cancelling the run ", error, threadid, runid;
    }
  }
  if (run == null || thread == null) {
    return 'No run or thread to cancel';
  }

  try {
    let runStatus = await assistantApi.getRun(thread.id, run.id);

    if (runStatus.completed !== null || runStatus.status === "cancelling") {
      return `Run ${run.id} status: ${runStatus.status} , completed: ${runStatus.completed}` 
    }
    let status = await assistantApi.cancelRun(thread.id, run.id);
    return status;
  } catch (error) {
    throw new Error(`
    Cancel run failed.  
    Best action is to simply wait for a while for it to timeout 
    The last alternative is to delete the Assistant ${assistant.name} and restart your session`);
  }
}
export default cancelRun;