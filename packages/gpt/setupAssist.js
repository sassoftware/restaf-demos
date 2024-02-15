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
import toolsSpec from './toolsSpec.js';
async function setupAssist(apiKey) {
  
  //setup control information
  let {tools, functionList} = toolsSpec(); 
  // setup request to chat
  const openai = new OpenAI({ apiKey: apiKey });
  let m = process.env.OPENAI_MODEL;
  let thread = await openai.beta.threads.create();
  let createArgs = {
    name: "SAS Assistant",
    instructions: "This is a test of the SAS Assistant",
    model: (m == null || m.trim().length === 0 ) ? 'gpt-4-turbo-preview' : m,
    tools: tools
  };
  let assistant = await openai.beta.assistants.create(createArgs);

  return {openai, assistant, thread, functionList};

  }
  export default setupAssist;