/*
* Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/
/**
 * Setup the GPT environment
 * @param {string} apiKey - openai api key
 * @returns {object} - openai, createArgs, functionList
 */
import OpenAI from 'openai';  
import gptFunctionSpecs from './gptFunctionSpecs.js';
function setupChat(apiKey) {
  const openai = new OpenAI({ apiKey: apiKey });
  let {functionSpecs, functionList} = gptFunctionSpecs(); 

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