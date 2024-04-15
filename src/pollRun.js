
/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @async
 * @private
 * @function pollRun
 * @description - Poll run status since there is no streaming support
 * @param {object} run - active run object 
 * @param {gptControl} gptControl - gpt  session control object
 * @returns {promise} - runStatus from client.beta.threads.runs.retrieve
 * @example - Will wait for completion(!(queued,in_progress, cancelling))
 */
async function pollRun(run, gptControl, tag) {
  let {assistantApi, thread} = gptControl;
  let done = null;
  let runStatus = null;
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  // Since there is no streaming support, sleep and poll the status
  tag = (tag == null) ? 'prompt' : tag;
  do {
   runStatus = await assistantApi.getRun(thread.id, run.id);
    
    tag = (tag == null) ? 'prompt' : tag;
    console.log("-------------------", tag, runStatus.status);
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