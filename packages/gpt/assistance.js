
/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * 
 * @param {string} openai - openai object 
 * @param {string} userRequest - user request to GPT
 * @param {*} appEnv - app environment object(has store, sessionID, etc.)
 * @returns {*} - response from GPT(can be text, string, html etc...)
 */

async function assistance(prompt, gptControl, appEnv) {
  let {openai, assistant, thread, functionList} = gptControl;

  //add the user request to thread
  const message = await openai.beta.threads.messages.create(
    thread.id,
    {
      role: "user",
      content: prompt
    }
  );

  let run = await openai.beta.threads.runs.create(
    thread.id,
    { 
      assistant_id: assistant.id,
      instructions: "Help user with their request",
    }
  );
  let runStatus = await openai.beta.threads.runs.retrieve(
    thread.id,
    run.id
  );

  const messages = await openai.beta.threads.messages.list(
    thread.id
  );
  debugger;
  return messages;
  }
export default assistance;

//https://platform.openai.com/docs/guides/text-generation/chat-completions-api