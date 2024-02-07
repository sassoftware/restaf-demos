/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

const OpenAI = require("openai");
let apiKey = process.env.APPENV_USERKEY;
let setup = require("../lib/setupViya");
const  gptFunctionSpecs = require("../gptfunctions/gptFunctionSpecs");  

let source = process.env.VIYASOURCE;
if (['cas', 'compute'].includes(source) == false) { 
  source = 'cas';
  console.log("VIYASOURCE not set, defaulting to cas");
}

setup(source)
  .then((appEnv) => main(apiKey, appEnv))
  .then((response) => {
    console.log(JSON.stringify(response, null,4));
  })
  .catch((err) => {
    console.log(JSON.stringify(err));
  });

async function main(apiKey, appEnv) {
  // setup openai
  const configuration = { apiKey: apiKey };
  const openai = new OpenAI(configuration);
  let {functionSpecs, messages, functionList} = gptFunctionSpecs();
  // setup request to chat
  let runtimeMessages = [{ role: "system", content: "You are an app builder for Viya" }];
  let createArgs = {
    model: "gpt-4",
    messages: runtimeMessages,
    functions: [functionSpecs],
  };

  program 
  .name('gptViya')
  .version('0.0.1')
  .description('GPT-4 with Viya')

  .program.command('ask')
  .description('enter prompt to ask GPT-4')
  .argument('<prompt>', 'prompt to ask GPT-4')
  .action((prompt) => {
    createArgs.messages = createArgs.messages.concat([
      { role: "user", content: prompt },
    ]);
    runGPTRuntime(createArgs, functionList, openai, appEnv)
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  });
  console.log("GPT-4 with Viya");
  program.parse(process.argv);
  console.log('xxx');

  async function runGPTRuntime(createArgs, functionList, openai, appEnv) {

    let finalResponse = "";
    try {
      let completion = await openai.chat.completions.create(createArgs);
      const completionResponse = completion.choices[0].message;
      if (completionResponse.content) {
        // gpt handled the request
        finalResponse = completionResponse.content;
      } else if (completionResponse.function_call) {
        // gpt thinks the function should handle the request
        let fname = completionResponse.function_call.name; 
        const params = JSON.parse(completionResponse.function_call.arguments);
        // call the custom function
        finalResponse = await functionList[fname](params, appEnv);
      }
    } catch (error) {
      return error;
    }
    messages.append(assistant_message)
    return finalResponse;
  }

}