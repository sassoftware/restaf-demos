/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import OpenAI from "openai";

let apiKey = process.env.OPENAI_KEY;

// read cmdline option and send it as prompt to gpt
let prompt = ' ';
if (process.argv.length >= 3 ) {
  for (let i=2; i < process.argv.length; i++) {
    prompt += process.argv[i] + ' ';
  }
} else {
  console.log('Usage: npm run basic <prompt>');
  process.exit(1);
}

main(prompt, apiKey)
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(error);
  });

//
// The rest of the story
//

async function main(prompt, apiKey) {
  // setup openai
  const configuration = { apiKey: apiKey };
  const openai = new OpenAI(configuration);

  // define a function spec
  const basicFunctionSpec = {
    name: "basic",
    description: "format a comma-separated keywords like a,b,c into html, array, object",
    parameters: {
      properties: {
        keywords: {
          type: "string",
          description: "A comma-separated list of keywords like a,b,c",
        },
        format: {
          type: "string",
          enum: ["html", "array", "object"],
          description: "Format the string"
        },
      },
      type: "object",
      required: ["keywords"]
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
   
  // gpt thinks the function should be called
  let fname = completionResponse.function_call.name; 
  console.log('function name returned: ' + fname);

  // parse arguments and call the function
  const params = JSON.parse(completionResponse.function_call.arguments);
 
  // call the function and return the response  
  let finalResponse = await basic(params);
  return finalResponse;

  }
    

// custom function - process request and return response to gpt
async function basic(params) {
  let { keywords, format } = params;

  // format based on user's request
  switch (format) {
    case "html":{
      let t = "<ul>";
      keywords.split(",").forEach((k) => {
        t += `<li>${k}</li>`;
      });
      t += "</ul>";
      return t;
    }
    case "array":
      return keywords.split(",");
    case "object":{
      return Object.assign({}, keywords.split(","));
    }
    default:
      return params;
  }
}


