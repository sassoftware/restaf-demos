/*
* Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/
import OpenAI from 'client';  
import specs from '../gptFunctions/functionSpecs.js'; 
/**
 * @description   Setup the GPT Chat
 * @function      setupChat
 * @private
 * @returns {object} - {client, createArgs, functionList,originalMessages}
 * @example  Here for reference only - not used in this library
 */


function setupChat() {
  let apiKey = process.env.OPENAI_KEY;
  const client = new OpenAI({ apiKey: apiKey });
  let {functionSpecs, functionList} = specs(); 

  // setup request to chat

  let m = process.env.OPENAI_MODEL;
  let createArgs = {
    model: (m == null || m.trim().length === 0 ) ? 'gpt-4' : m,
    messages: [{ role: "system", content: "you are designed to access Viya" }],
    functions: functionSpecs
  };

  
  return {client, createArgs,functionList, originalMessages: [].concat(createArgs.messages)};

  }
  export default setupChat;
  // https://learn.microsoft.com/en-us/javascript/assistantApi/overview/azure/client-assistants-readme?view=azure-node-preview&source=recommendations
