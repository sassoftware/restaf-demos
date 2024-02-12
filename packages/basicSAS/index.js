/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import OpenAI from "openai";
import restaflib from "@sassoftware/restaflib";
import setupViya from "../lib/setupViya.js";
import fs from "fs/promises";
import logAsArray from "../lib/logAsArray.js";   

let apiKey = process.env.OPENAI_KEY;

// read cmdline option and send it as prompt to gpt
let prompt = ' ';
if (process.argv.length >= 3 ) {
  for (let i=2; i < process.argv.length; i++) {
    prompt += process.argv[i] + ' ';
  }
} else {
  console.log('Usage: npm run basicsas file filepath');
  process.exit(1);

}
let source = process.env.VIYASOURCE;
if (['cas', 'compute'].includes(source) == false) { 
  source = 'cas';
  console.log("VIYASOURCE not set, defaulting to cas");
}

// logon to Viya and then call main function to process the request
setupViya(source)
  .then((appEnv) => main(prompt, apiKey, appEnv))
  .then((response) => {
    console.log(JSON.stringify(response, null,4));
  })
  .catch((err) => {
    console.log(JSON.stringify(err));
  });

// call main function to process the request
async function main(prompt, apiKey, appEnv) {
  // setup openai
  const configuration = { apiKey: apiKey };
  const openai = new OpenAI(configuration);

  // define a function spec
  const basicFunctionSpec = {
    name: "basic",
    description: "run the specified file",
    parameters: {
      properties: {
        file: {
          type: "string",
          description: "this is the file to run",
        }
      },
      type: "object",
      required: ["code"],
    },
  };

  // setup request to chat
  let messages = [{ role: "system", content: "You are an app builder for Viya" }];
  let createArgs = {
    model: "gpt-4",
    messages: messages,
    functions: [basicFunctionSpec],
  };

  // add prompt to messages array
  createArgs.messages.push({ role: "user", content: prompt })
  
  // send request to chat and handle response
  let completion = await openai.chat.completions.create(createArgs);

  // completion from gpt
  const completionResponse = completion.choices[0].message;
  
  // prompt was handled by gpt
  if (completionResponse.content) {  
    let finalResponse = completionResponse.content;
    return finalResponse;
  }
   
  // gpt thinks the function should be calledsas-viya auth login
  let fname = completionResponse.function_call.name; 
  console.log('function name returned: ' + fname);

  // parse arguments and call the function
  const params = JSON.parse(completionResponse.function_call.arguments);
 
  // call the function and return the response  
  let finalResponse = await basic(params, appEnv);
  return finalResponse;

}

// custom function - process request and return response to gpt
async function basic(params, appEnv) {
  let { file } = params;
  let {store, session} = appEnv;
 
  // see if file was specified
 let src = '';
  try { 
    src= await fs.readFile(file, 'utf8');
  }
  catch (err) {
    console.log(err);
    return "Error reading file " + file + " " + err;
  }

  if (appEnv.source === "cas") {
    let r = await restaflib.caslRun(store, session, src,{}, true);
    // do additional processing if needed 
    return r;
  } else {
    // compute service
    let computeSummary = await restaflib.computeRun(store, session, src);
    let r = await restaflib.computeResults(store, computeSummary, 'listing');
    return logAsArray(r);
  }

  
}
