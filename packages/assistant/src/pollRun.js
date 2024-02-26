
/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @async
 * @description - Poll run status since there is no streaming support
 * @function pollRun
 * @params {object} openai - openai object
 * @params {object} thread - thread object
 * @params {object} run - run object    
 * @params {object} gptControl - gpt  session control object
 * @returns {object} - runStatus from openai.beta.threads.runs.retrieve
 */
async function pollRun(thread, run, gptControl) {
  let { openai, assistant} = gptControl;
  let done = null;
  let runStatus = null;
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  // Since there is no streaming support, sleep and poll the status
  do {
    debugger;
    runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    debugger;
    console.log("-------------------", runStatus.status);
    if (
      !(
        runStatus.status === "queued" ||
        runStatus.status === "in_progress" ||
        runStatus.status === "cancelling"
      )
    ) {
      done = runStatus.status;
    } else {
      await sleep(2000);
      // console.log("waited 2000 ms");
    }
  } while (done === null);

  let newAssistant = await openai.beta.assistants.update(assistant.id, {
    metadata: { thread_id: thread.id, lastRunId: run.id} 
  });
  gptControl.assistant = newAssistant;
  return runStatus;

}
export default pollRun;