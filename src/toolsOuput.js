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
 * @param {gotControl} appControl
 * @param {object} run - run object
 * @param {object} toolsOutput - output from the tools
 * @returns {promise} - return status from submitToolOutputs
 */

async function toolsOutput(appControl, run, toolsOutput) {
  let {thread, assistantApi} = appControl;
  let newRun = await assistantApi.submitToolOutputs(
   thread.id, run.id, { tool_outputs: toolsOutput });
 
 // wait for output to appear in the thread messages
  let outputStatus = await pollRun(thread, newRun, appControl);
  return outputStatus;
}
export default toolsOutput;