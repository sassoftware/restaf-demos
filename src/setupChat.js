/*
* Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/
/**
 * @description   Setup the GPT Chat
 * @function      setupChat
 * @returns {object} - {openai, createArgs, functionList,originalMessages}
 * @notes  Here for reference only - not used in this library
 */
// https://learn.microsoft.com/en-us/javascript/api/overview/azure/openai-assistants-readme?view=azure-node-preview&source=recommendations
import OpenAI from 'openai';  
import specs from '../gptFunctions/functionSpecs.js'; 
function setupChat() {
  let apiKey = process.env.OPENAI_KEY;
  const openai = new OpenAI({ apiKey: apiKey });
  let {functionSpecs, functionList} = specs(); 

  // setup request to chat

  let m = process.env.OPENAI_MODEL;
  let createArgs = {
    model: (m == null || m.trim().length === 0 ) ? 'gpt-4' : m,
    messages: [{ role: "system", content: "you are designed to access Viya" }],
    functions: functionSpecs
  };

  
  return {openai, createArgs,functionList, originalMessages: [].concat(createArgs.messages)};

  }
  export default setupChat;