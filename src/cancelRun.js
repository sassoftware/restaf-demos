/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @async
 * @description - Cancel a previous run (on user request)
 * @function cancelRun
 * @param {gptControl} gptControl - gpt  session control object
 * returns {promise} - status (null if no run or thread or failed to cancel)
 * @example - This function will cancel the run
 */

async function cancelRun(gptControl, threadid, runid) {
  let {assistantApi, assistant, thread, run} = gptControl;  

  if (threadid != null || runid != null) {
    try {
      console.log('Cancelling run', threadid, runid);
      let status = await assistantApi.cancelRun(threadid, runid);
      return status;
    } catch (error) {
      console.log("Error cancelling the run ", error, threadid, runid);
      return null;
    }
  }
  if (run == null || thread == null) {
    console.log('No run or thread to cancel');
    return null;
  }
  let status = null;
  try {
    let runStatus = await assistantApi.getRun(thread.id, run.id);
    console.log(runStatus);
    if (runStatus.completed !== null || runStatus.status === "cancelling") {
      console.log(`Run ${run.id} status: ${runStatus.status} , completed: ${runStatus.completed}`);  
      return null;
    }
    status = await assistantApi.cancelRun(thread.id, run.id);
  } catch (error) {
    console.log("Error cancelling the run", error);
    throw new Error(`
    Cancel run failed.  
    Best action is to simply wait for a while for it to timeout 
    The last alternative is to delete the Assistant ${assistant.name} and restart your session`);
  }
  return status;
}
export default cancelRun;