/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import OpenAI from "openai";
import restaflib from "@sassoftware/restaflib";
import setupViya from "../lib/setupViya.js";
import fs from "fs/promises";
import logAsArray from "../lib/logAsArray.js";    
let apiKey = process.env.API_USER_KEY;

//let fss = fs.promises ;

// read cmdline option and send it as prompt to gpt
let prompt = ' ';
if (process.argv.length > 1 ) {
  for (let i=2; i < process.argv.length; i++) {
    prompt += process.argv[i] + ' ';
  }
} 
let source = process.env.VIYASOURCE;
if (['cas', 'compute'].includes(source) == false) { 
  source = 'cas';
  console.log("VIYASOURCE not set, defaulting to cas");
}

setupViya(source)
  .then((appEnv) => main(prompt, apiKey, appEnv))
  .then((response) => {
    console.log(JSON.stringify(response, null,4));
  })
  .catch((err) => {
    console.log(JSON.stringify(err));
  });

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
  let createArgs = {
    model: "gpt-4",
    messages: [{ role: "system", content: "You are an app builder for Viya" }],
    functions: [basicFunctionSpec],
  };
  // add prompt to messages array
  createArgs.messages.push({ role: "user", content: prompt })
  
  // send request to chat and handle response

  let finalResponse = "";
  try {
    let completion = await openai.chat.completions.create(createArgs);
    const completionResponse = completion.choices[0].message;
    if (completionResponse.content) {
      // gpt handled the request
      finalResponse = completionResponse.content;
    } else if (completionResponse.function_call) {
      // gpt thinks the function should handle the request
      // let fname = completionResponse.function_call.name; just to show this is in the completionResponse 
      const params = JSON.parse(completionResponse.function_call.arguments);
      // call the custom function
      finalResponse = await basic(params, appEnv);
    }
  } catch (error) {
    return error;
  }
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
    return "Error reading file" + file;
  }

  if (appEnv.source === "cas") {
    let r = await restaflib.caslRun(store, session, src,{}, true);
    // do additional processing if needed 
    return r.results;
  } else {
    let computeSummary = await restaflib.computeRun(store, session, src);
    let log = await restaflib.computeResults(store, computeSummary, "log");
    return {log: logAsArray(log)};
  }

  
}
