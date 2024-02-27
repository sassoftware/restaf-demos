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
 * @param {object} appEnv - Viya session control object(has store, sessionID, etc. to talk to Viya server)
 * @returns {*} - response from GPT(can be text, string, html etc...)
 */

async function runAssistant(prompt, gptControl, appEnv) {
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
    console.log(`status = ${error.status}. Unable to add the prompt to the thread`);
    console.log('will try to cancel the last run');
    console.log(error);
    if (error.status === 400 && assistant.metadata.lastRunId !== '0') {
      try {
        run = await openai.beta.threads.runs.cancel(thread.id, assistant.metadata.lastRunId);
        assistant = await openai.beta.assistants.update(assistant.id, {
          metadata: { thread_id: thread.id, lastRunId: run.id }})
        gptControl.assistant = assistant;
        console.log("Cancelled the last run");
      } catch (error) {
        console.log('Unable to cancel the last run');
        console.log(error);
      }
    } else {
      await openai.beta.threads.del(thread.id);
      thread = await openai.beta.threads.create({
        metadata: { assistanceName: assistant.name, lastRunId: '0'},
      });
      gptControl.thread = thread;
      console.log("Deleted old thread and created a new one");
      
    }
  }
  newMessage = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: prompt,
  });
  // console.log(assistant.id);
  // console.log(JSON.stringify(thread, null, 4));
  run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistant.id,
    instructions: `Help user use SAS Viya to accomplish a task
                      Allow users to query for information from a Viya Server.
                      Allow users to query the retrieved information`,
  });

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
