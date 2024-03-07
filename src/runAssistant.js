/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import getLatestMessage from "./getLatestMessage.js";
import required_action from "./required_action.js";
import pollRun from "./pollRun.js";

/**
 * @async
 * @description - Run the latest prompt from the user
 * @function runAssistant
 *
 * @param {object} gptControl - gpt  session control object
 * @param {string} prompt - user's prompt
 * @param {string} instructions - Additional instructions for the run
 * @param {object} appEnv - application info - ex: Viya session control object(has store, sessionID, etc. to talk to Viya server)
 
 * @returns {promise} - response from GPT(can be text, string, html etc...)
 * @notes - This function will run the assistant with the prompt and return the response from the assistant.
 * @example 
 *  let response = await runAssistant(gptControl, prompt, promptInstructions,appEnv); 
*/

async function runAssistant(gptControl,prompt, instructions, appEnv) {
  let { client, thread } = gptControl;

  //add the user request to thread
  try {
    let _newMessage = await client.beta.threads.messages.create(thread.id, {
      role: "user",
      content: prompt,
    });
  } catch (error) {
    debugger;
    console.log(error);
    throw new Error('Request failed on adding user message to thread.');
  }
  // now run the thread
  // assume caller will catch any thrown errors
  let r = await runPrompt(gptControl, appEnv, instructions);
  return r;
}
async function runPrompt(gptControl, appEnv, instructions) {
  let { client, assistant, thread } = gptControl;
  let runArgs = {
    assistant_id: assistant.id,
    instructions: instructions != null ? instructions : "",
  };
  // Run the assistant with the prompt and poll for completion
  let run = await client.beta.threads.runs.create(thread.id, runArgs);
  let runStatus = await pollRun(thread, run, gptControl);

  //check for completion status
  let message;
  if (runStatus.status === "completed") {
    message = await getLatestMessage(gptControl, 5);
  } else if (runStatus.status === "requires_action") {
    // make sure that required_action closes the thread run
    let r = await required_action(runStatus, thread, run, gptControl, appEnv);
    console.log('getting latest message ')
    message = await getLatestMessage(gptControl, 5);
  } else {
    message = [{ runStatus: runStatus.status }];
  }
  return message;
}
export default runAssistant;

//https://platform.openai.com/docs/guides/text-generation/chat-completions-api
