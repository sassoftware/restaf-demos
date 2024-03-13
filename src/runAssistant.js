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
    let _newMessage = await assistantApi.createMessage(thread.id,'user',prompt);
  } catch (error) {
    debugger;
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
  let runArgs = {
    assistantId: assistant.id,
    instructions: instructions != null ? instructions : '',
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
export default runAssistant;

//https://platform.openai.com/docs/guides/text-generation/chat-completions-assistantApi
