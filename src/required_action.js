
/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import pollRun from "./pollRun.js";
import createFile from "./createFile.js";

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
  let{assistantApi,appEnv, domainTools, provider, thread, run} = gptControl;
  let {functionList} = domainTools;
  
  // get the required actions from the run status

  let requiredActions = (provider === 'openai') 
                          ? runStatus.required_action.submit_tool_outputs.tool_calls
                          : runStatus.requiredAction.submitToolOutputs.toolCalls;
  
  let toolsOutput = [];
  let lastToolCallId = null;
  let functionName = null;
  let fileList = [];

  for (let action of requiredActions) {
    functionName = action.function.name;
    lastToolCallId = action.id;

    console.log('Requested function: ', functionName);
    let params = JSON.parse(action.function.arguments);
    console.log('Parameters: ', params);
    
    let target = functionList[functionName];
    if (target == null){
      let err = (`Function ${functionName} not found. 
      Probable causes: 
        Using thread that had outdated tool references.
        Currrent specs point has mistmatch with function name
        `);
      let o = {
        toolCallId: action.id,
        output: JSON.stringify(err)
      };
      toolsOutput.push(o);
    } else {
      try {
        let elapsedTime = Date.now();
        let iresponse = await functionList[functionName](params, gptControl.userData, gptControl);
        let response = (iresponse._message != null) ? iresponse._message : iresponse;
        if (iresponse._file != null) {
          fileList.push({functionName: functionName, file: iresponse._file});
        }

        elapsedTime = Math.round((Date.now() - elapsedTime) / 1000);
        console.log(`>> Function call ${functionName} completed in ${elapsedTime} seconds`);
        console.log(`>> Function call ${functionName} completed`);
          toolsOutput.push({
            toolCallId: action.id,
            output: response
          });
      }
      catch(err){
        let o = {
          toolCallId: action.id,
          output: JSON.stringify(err)
        };
        toolsOutput.push(o);
      }
    }
 }  
// submit the outputs to the thread
 
if (fileList.length > 0){
  fileList.forEach(async (f) => {
    let newFile = await createFile(f.functionName + '.txt', f.file, 'text/plain', gptControl);
    console.log('uploading file', newFile);
  });
}

console.log('submitting output to the thread');
let newRun = await assistantApi.submitToolOutputsToRun(thread.id, run.id, toolsOutput );


// wait for output to appear in the thread messages
 let outputStatus = await pollRun(newRun, gptControl, 'output');

return outputStatus;
}

export default required_action;