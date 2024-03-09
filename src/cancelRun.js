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

async function cancelRun(gptControl) {
  let {assistantApi, thread, run} = gptControl;  

  if (run === null || thread === null) {
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
  }
  return status;
}
export default cancelRun;