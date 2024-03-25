/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import getLatestMessage from './getLatestMessage.js';
import required_action from './required_action.js';
import pollRun from './pollRun.js';
//import toolsOutput from './toolsOuput.js';

/**
 * @async
 * @description - Run the latest prompt from the user
 * @function runAssistant
 *
 * @param {gptControl} gptControl - gpt  session control object
 * @param {string} prompt - user's prompt
 * @param {string} instructions - Additional instructions for the run 
 * @returns {promise} - response from GPT(can be text, string, html etc...)
 * @example - This function will run the assistant with the prompt and return the response from the assistant.
 * @example 
 *  let prompt = 'fetch 20 records from cars from public';
 *  let promptInstructions = 'some instructions';
 *  let response = await runAssistant(gptControl, prompt, promptInstructions); 
 *  console.log(response);
 */


async function runAssistant(gptControl,prompt, instructions) {
  let {thread, assistantApi, appEnv } = gptControl;

  //add the user request to thread
  try {
    // this seems to improve retrieval using files.
    let opts = {};
    if (gptControl.provider === 'openai') {
      opts.file_ids = gptControl.assistant.file_ids;
    } else {
      opts.fileIds = gptControl.assistant.fileIds;
    }
    let _newMessage = await assistantApi.createMessage(thread.id,'user',prompt, opts);
  } catch (error) {
    console.log(error.status);
    console.log(error.error);
     throw new Error(`
     Request failed on adding user message to thread.
     See error below. 
     If thread is active, you can try canceling the run.
     ${error.status} ${error.error}`);
  }
  // now run the thread
  // assume caller will catch any thrown errors
  let r = await runPrompt(gptControl, appEnv, instructions);
  return r;
}
async function runPrompt(gptControl, appEnv, instructions) {
  let { assistantApi, assistant, thread } = gptControl;
  console.log(instructions);
  let runArgs = {
    assistantId: assistant.id,
    instructions: formatInstructions(instructions),
    tools: assistant.tools
  };
  // Run the assistant with the prompt and poll for completion
  debugger;
  let run = await assistantApi.createRun(thread.id, runArgs);
  gptControl.run = run;
  let runStatus = await pollRun(run, gptControl);

  //check for completion status
  let message;
  if (runStatus.status === 'completed') {
    message = await getLatestMessage(gptControl, 5);
  } else if (runStatus.status === 'requires_action') {
    // make sure that required_action closes the thread run
    
    let r = await required_action(runStatus, gptControl, appEnv);
    console.log('getting latest message ')
    message = await getLatestMessage(gptControl, 5);
  } else {
    message = [{ runStatus: runStatus.status }];
  }
  return message;
}
function formatInstructions(instructions) {
  let inst = `
  
  Format the response as a html table if the content of the response is one of the following schema:

  - a comma-delimited format 
  - this schema{a: {a1:10, bx:20, c: {cx:3, az: 4}} }, {d: {d1:10, d2:20},...}
  - this schema [{a1:1,b1:1}, {a1:1, b1:2}. ...}]
  

  Below is an example of a  html table format with nested table

      '<table>     
         <tr>     
           <th>Name</th>     
           <th>Value</th>     
         </tr>     
         <tr>     
           <td>a</td>     
           <td>     
             <table>     
               <tr>     
                 <th>Name</th>     
                 <th>Value</th>     
               </tr>     
               <tr>     
                 <td>a1</td>     
                 <td>10</td>     
               </tr>     
               <tr>     
                 <td>bx</td>     
                 <td>20</td>     
               </tr>     
               <tr>     
                 <td>c</td>     
                 <td>     
                   <table>     
                     <tr>     
                       <th>Name</th>     
                       <th>Value</th>     
                     </tr>     
                     <tr>     
                       <td>cx</td>     
                       <td>3</td>     
                     </tr>     
                     <tr>     
                       <td>az</td>     
                       <td>4</td>     
                     </tr>     
                   </table>     
                 </td>     
               </tr>     
             </table>     
           </td>     
         </tr>     
         <tr>     
           <td>d</td>     
           <td>     
             <table>     
               <tr>     
                 <th>Name</th>     
                 <th>Value</th>     
               </tr>     
               <tr>     
                 <td>d1</td>     
                 <td>10</td>     
               </tr>     
               <tr>     
                 <td>d2</td>     
                 <td>20</td>     
               </tr>     
             </table>     
           </td>     
         </tr>     
       </table>     
     '

  if the response from a tool is of the form  like ['a','b','c', ...] or [1,11,8, ...] or
  ['- a','- b','- c', ...] or ['1. xxx', '2. yyy', '3. zzz']
  then format it as  html ordered or unordered list element
  Below is a sample html list format.
  '<ul>
    <li>a</li>
    <li>b</li>
    <li>3</li>
  </ul>'


  if the response from a tool is of the form {a:1,b:2} then format it as  html table with a single column.
  '<table>
  <tr>
  <th>Name</th>
  <th>Value</th>
  </tr>
    <tr>
      <td>a</td>
      <td>1</td>
    </tr>
    <tr>
      <td>b</td>
      <td>1</td>
    </tr>

  </table>'

  The suggested styling for the html table is as follows:
    The html table should have a light blue background for the column headers.
    Use a border width of 1px and solid style for the table.

  
  `;

  if (instructions != null) {
    inst = instructions + inst;
  }
  return inst;
}
export default runAssistant;

//https://platform.openai.com/docs/guides/text-generation/chat-completions-assistantApi
