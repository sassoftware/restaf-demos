
/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @async
 * @private
 * @description - Poll run status since there is no streaming support
 * @function pollRun
 * @param {object} run - active run object 
 * @param {gptControl} gptControl - gpt  session control object
 * @returns {object} - runStatus from client.beta.threads.runs.retrieve
 * @example - Will wait for completion(!(queued,in_progress, cancelling))
 */
async function pollRun(run, gptControl) {
  let {assistantApi, thread} = gptControl;
  let done = null;
  let runStatus = null;
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  // Since there is no streaming support, sleep and poll the status
  do {
    

   runStatus = await assistantApi.getRun(thread.id, run.id);
    
    console.log("-------------------", runStatus.status);
    if ( !(runStatus.status === "queued" ||runStatus.status === "in_progress" ||
          runStatus.status === "cancelling")) {
      
      done = runStatus.status;
    } else {
      await sleep(500);
      console.log("waited 500 ms");
    }
  } while (done === null);

  return runStatus;

}
export default pollRun;