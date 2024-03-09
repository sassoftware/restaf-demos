
/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import pollRun from "./pollRun.js";
/**
 * @async
 * @private
 * @function required_action
 * @description   Get the required action from the run status and execute the action
 * @param {object} runStatus - run status object
 * @param {gptControl} gptControl - gptControl object
 * @returns {promise} - return the output status
 *  
 * @example
 *  let outputStatus = await required_action(runStatus, gptControl);
 */

async function required_action(runStatus,gptControl) {
  let{assistantApi,appEnv, domainSpecs, provider, thread, run} = gptControl;
  let {functionList} = domainSpecs;
  
  // get the required actions from the run status

  let requiredActions = (provider === 'openai') 
                          ? runStatus.required_action.submit_tool_outputs.tool_calls
                          : runStatus.requiredAction.submitToolOutputs.toolCalls;
  
  let toolsOutput = [];
  for (let action of requiredActions) {
    let functionName = action.function.name;
    console.log('Requested function: ', functionName);
    let params = JSON.parse(action.function.arguments);
    debugger;
    try {
       let response = await functionList[functionName](params, appEnv, gptControl);
       if (provider === 'openai') {
        toolsOutput.push({
          tool_call_id: action.id,
          output: JSON.stringify(response),
        });
      } else {
        toolsOutput.push({
          toolCallId: action.id,
          output: JSON.stringify(response),
        });
      }
    }
    catch(err){
      toolsOutput.push({
        tool_call_id: action.id,
        output: JSON.stringify(err),
      })
    }
 }
// submit the outputs to the thread
 console.log('Adding output to messages');
 let newRun = (provider === 'openai') 
            ? await assistantApi.submitToolOutputsToRun(
                thread.id, run.id, { tool_outputs: toolsOutput })
            : await assistantApi.submitToolOutputs( 
                thread.id, run.id, toolsOutput);

// wait for output to appear in the thread messages
 let outputStatus = await pollRun(newRun, gptControl);

return outputStatus;
}


export default required_action;