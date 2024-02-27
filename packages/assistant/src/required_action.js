
/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @async
 * @description - Handle required actions for Assistant
 * @function required_action
 * @param {string} prompt - User prompt
 * @param {object} gptControl - gpt  session control object
 * @param {object} appEnv - Viya session control object(has store, sessionID, etc. to talk to Viya server)
 * @returns {*} - response from GPT(can be text, string, html etc...)
 */
import pollRun from "./pollRun.js";
async function required_action(runStatus, thread, run,  gptControl, appEnv) {
  let{openai,specs} = gptControl;
  let {functionList} = specs;
  
  let requiredActions = runStatus.required_action.submit_tool_outputs.tool_calls;
  
  let toolsOutput = [];
  for (let action of requiredActions) {
    let functionName = action.function.name;
    console.log('Requested function: ', functionName);
    let params = JSON.parse(action.function.arguments);
    let response = await functionList[functionName](params, appEnv, gptControl);

    toolsOutput.push({
      tool_call_id: action.id,
      output: JSON.stringify(response),
    });
 }
// submit the outputs to the thread
 let newRun = await openai.beta.threads.runs.submitToolOutputs(
  thread.id, run.id, { tool_outputs: toolsOutput });

// wait for output to appear in the thread messages
 let outputStatus = await pollRun(thread, newRun, gptControl);

return outputStatus;
}
export default required_action;