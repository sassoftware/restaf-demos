
/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @async
 * @description - Poll run status since there is no streaming support
 * @function pollRun
 * @params {object} client - client object
 * @params {object} thread - thread object
 * @params {object} run - run object    
 * @params {object} gptControl - gpt  session control object
 * @returns {object} - runStatus from client.beta.threads.runs.retrieve
 * @notes - Will wait for completion(!(queued,in_progress, cancelling))
 */
async function pollRun(thread, run, gptControl) {
  let { client} = gptControl;
  let done = null;
  let runStatus = null;
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  // Since there is no streaming support, sleep and poll the status
  do {
    debugger;
    runStatus = await client.beta.threads.runs.retrieve(thread.id, run.id);
    
    console.log("-------------------", runStatus.status);
    if (
      !(
        runStatus.status === "queued" ||
        runStatus.status === "in_progress" ||
        runStatus.status === "cancelling"
      )
    ) {
      debugger;
      done = runStatus.status;
    } else {
      await sleep(2000);
      console.log("waited 2000 ms");
    }
  } while (done === null);

  /*
  let newAssistant = await client.beta.assistants.update(assistant.id, {
    metadata: { thread_id: thread.id, lastRunId: run.id} 
  });
  */
  debugger;
 //  gptControl.assistant = newAssistant;
  return runStatus;

}
export default pollRun;