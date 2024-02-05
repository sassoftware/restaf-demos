/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

const OpenAI = require("openai");
let apiKey = process.env.APPENV_USERKEY;
let setup = require("../lib/setup");
let {caslRun, computeRun, computeResults} = require("@sassoftware/restaflib");
let fs = require("fs").promises ;

// read cmdline option and send it as prompt to gpt
let prompt = process.argv[2];
let source = process.env.VIYASOURCE;
if (['cas', 'compute'].includes(source) == false) { 
  source = 'cas';
  console.log("VIYASOURCE not set, defaulting to cas");
}

setup(source)
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
    description: "run the code or file. code is specified as code='abc'. file is the path to the file to run. it is specified as file=abc. Format response as JSON",
    parameters: {
      properties: {
        code: {
          type: "string",
          description: "code to be run",
        },
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
  if (prompt !== null) {
    createArgs.messages = createArgs.messages.concat([
      { role: "user", content: prompt },
    ]);
  }
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
      fname =
        completionResponse.function_call
          .name; /* just to show this is in the completionResponse */
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
  let { code, file } = params;
  let {store, session} = appEnv;
  let filesrc = null;
  
  // see if file was specified
  if (file != null) {
    try { 
      src= await fs.readFile(file, 'utf8');
    }
    catch (err) {
      return "Error reading file" + file;
    }
  } else {
    src = code;
  }
  // if code was a also specified treat is preamble to code from file

  if (src != null) {
    if (appEnv.source === "cas") {
      let r = await caslRun(store, session, src,{}, true); 
      return r.results;;
    } else {
      let computeSummary = await computeRun(store, session, src);
      let log = await computeResults(store, computeSummary, "log");
      return log;
    }
  }
  
}
