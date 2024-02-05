/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import  OpenAI from 'openai';
import gptFunctionSpecs from "./gptFunctionSpecs";
/**
 * 
 * @param {string} apiKey - OpenAI API key- 
 * @param {string} userRequest - user request to GPT
 * @param {*} appEnv - app environment object(has store, sessionID, etc.)
 * @returns {*} - response from GPT(can be text, string, html etc...)
 */

async function gptPrompt(apiKey, userRequest, appEnv) {
  const configuration = { apiKey: apiKey, dangerouslyAllowBrowser: true };
  const openai = new OpenAI(configuration);
  let {functionSpecs, messages, functionList}= gptFunctionSpecs();
  debugger;
  try {
    let createArgs = {
      model: "gpt-4",
      messages: [
        {'role': 'system', content: 'You are a prompt manager for viya applications' }
      ],
      functions: functionSpecs,
    };
   
    // Add the user request to the messages array
    if (userRequest !== null && userRequest.trim().length > 0) {
      let newPrompt = {role: 'user', content: userRequest};
      createArgs.messages = createArgs.messages.concat([newPrompt]);
    }
    
    // The actual call to GPT
    let completion = await openai.chat.completions.create(createArgs);
    const completionResponse = completion.choices[0].message;
    
    // Handle response from gpt
    if (completionResponse.content) {
      // gpt decided not to call our functions. Return the response from gpt
      console.log(completionResponse.content);
      return completionResponse.content;
    } else if (completionResponse.function_call) {
      // gpt wants us to call the specified function and return the result
      const fname = completionResponse.function_call.name;
      const params = JSON.parse(completionResponse.function_call.arguments);
      let response = await functionList[fname](params,appEnv);
      return response;
    }
  } catch (error) {
    debugger;
    console.log(error);
    return {Error: error};
  }
}


export default gptPrompt;
