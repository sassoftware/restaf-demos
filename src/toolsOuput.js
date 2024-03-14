/*
 * Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import pollRun from "./pollRun.js";
/**
 * @async
 * @private
 * @function toolsOutput
 * @description   Output the results of the tools
 * @param {gotControl} gptControl
 * @param {object} run - run object
 * @param {object} toolsOutput - output from the tools
 * @returns {promise} - return status from submitToolOutputs
 */

async function toolsOutput(gptControl, run, toolsOutput) {
  let {thread, assistantApi} = gptControl;
  let newRun = await assistantApi.submitToolOutputs(
   thread.id, run.id, { tool_outputs: toolsOutput });
 
 // wait for output to appear in the thread messages
  let outputStatus = await pollRun(thread, newRun, gptControl);
  return outputStatus;
}
export default toolsOutput;