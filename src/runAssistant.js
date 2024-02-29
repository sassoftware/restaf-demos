/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import getLatestMessage from "./getLatesMessage.js";
import required_action from "./required_action.js";
import pollRun from "./pollRun.js";

/**
 * @async
 * @description - Run the latest prompt from the user
 * @function runAssistant
 * @param {string} prompt - User prompt
 * @param {object} gptControl - gpt  session control object
 * @param {object} appEnv - application info - ex: Viya session control object(has store, sessionID, etc. to talk to Viya server)
 * @param {string} instructions - Additional instructions for the run
 * @returns {*} - response from GPT(can be text, string, html etc...)
 * @notes - This function will run the assistant with the prompt and return the response from the assistant.
 */

async function runAssistant(prompt, gptControl, appEnv, instructions) {
  let { openai, assistant, thread, specs } = gptControl;
  let {functionList} = specs;

  //add the user request to thread
  let run = null;
  let newMessage = null;
  try {
    newMessage = await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: prompt,
    });
  } catch (error) {
    //tbd: recovery?
    console.log(`status = ${error.status}. Unable to add the prompt to the thread`);
    console.log('will try to cancel the last run');
    return {status: error.status, message: error};
  }
  
  // console.log(assistant.id);
  // console.log(JSON.stringify(thread, null, 4));
  let runArgs = {
    assistant_id: assistant.id,
    instructions: (instructions != null) ? instructions : ''
  };

  run = await openai.beta.threads.runs.create(thread.id, runArgs);

  // Poll and wait for the run to complete
  let runStatus = await pollRun(thread, run, gptControl);
  
  if (runStatus.status === "completed") {
    
    const message = await getLatestMessage  (openai, thread, 1);
    return message; 
  } else if (runStatus.status === 'requires_action') {
    let r = await required_action(
      runStatus,
      thread,
      run,
      gptControl,
      appEnv
    );
    let message = await getLatestMessage  (openai, thread,1);
    return message;
  } else {
    return { runStatus: runStatus.status };
  }
}
export default runAssistant;

//https://platform.openai.com/docs/guides/text-generation/chat-completions-api
