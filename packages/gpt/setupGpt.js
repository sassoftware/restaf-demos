/*
* Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/
/**
 * Setup the GPT environment
 * @param {string} apiKey - openai api key
 * @returns {object} - openai, createArgs, functionList
 */
import  OpenAI from 'openai';  
import  gptFunctionSpecs from './gptFunctionSpecs.js';
function setupGpt(apiKey) {
  const openai = new OpenAI({ apiKey: apiKey });
  let {functionSpecs, functionList} = gptFunctionSpecs(); 

  // setup request to chat

  let createArgs = {
    model: (process.env.OPENAI_MODEL == null) ? 'gpt-4' : process.env.OPENAI_MODEL,
    messages: [{ role: "system", content: "you are designed to specific questions using the functions" }],
    functions: functionSpecs
  };

  
  return {openai, createArgs,functionList};

  };
  export default setupGpt;