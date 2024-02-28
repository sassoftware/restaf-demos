/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @async
 * @description This function is the main entry for chatgpt
 * @function chatgpt
 * @param {string} openai - openai object 
 * @param {string} userRequest - user request to GPT
 * @param {object} gptControl - gpt session control object
 * @param {object} appEnv - Viya Session environment (has store, sessionID, etc.)
 * @returns {promise} - response from GPT(can be text, string, html etc...)
 */

async function chatgpt(prompt, gptControl, appEnv) {
  let {openai, createArgs, functionList} = gptControl;
  try {
    //add user prompt to the message array
    createArgs.messages.push({ role: "user", content: prompt })
    
    // The actual call to GPT
    let completion = await openai.chat.completions.create(createArgs);

    const completionResponse = completion.choices[0].message;
   
    // Handle response from gpt
    if (completionResponse.content) {
      // gpt decided not to call our functions. Return the response from gpt
      return completionResponse.content;
    } else if (completionResponse.function_call) {
      // gpt wants us to call the specified function and return the result
      const fname = completionResponse.function_call.name;
      const params = JSON.parse(completionResponse.function_call.arguments);

      //handle management functions
      
      if (fname === 'clearChat') {
        return 'clear'
      } 
      if (fname === 'historyChat') {
        return createArgs.messages
      }
      let response = await functionList[fname](params, appEnv);

      // push the response from the function to the messages array
      createArgs.messages.push({ role: "assistant", content: JSON.stringify(response) });
      return response;
    }
  } catch (error) {
    
    console.log(error);
    return {Error: error};
  }
}


export default chatgpt;

//https://platform.openai.com/docs/guides/text-generation/chat-completions-api