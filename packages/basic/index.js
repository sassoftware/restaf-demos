/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

const OpenAI = require("openai");
let apiKey = process.env.APPENV_USERKEY;

// read cmdline option and send it as prompt to gpt
let prompt = process.argv[2];


main(prompt, apiKey)
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(error);
  });

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
          description: "Format is html, array, object"
        },
      },
      type: "object",
      required: ["keywords"]
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
  let fname = "gpt";
  let finalResponse = "";
  try {
    let completion = await openai.chat.completions.create(createArgs);
    const completionResponse = completion.choices[0].message;

    if (completionResponse.content) { // gpt handled the request
      finalResponse = completionResponse.content;
    } else if (completionResponse.function_call) { // gpt thinks the function should handle the request
      fname = completionResponse.function_call.name;
      const params = JSON.parse(completionResponse.function_call.arguments);
      // call the custom function
      finalResponse = await basic(params);
    }
  } catch (error) {
    return error;
  }
  return finalResponse;
}

// custom function - process request and return response to gpt
async function basic(params) {
  let { keywords, format } = params;

  switch (format) {
    case "html":
      let t = "<ul>";
      keywords.split(",").forEach((k) => {
        t += `<li>${k}</li>`;
      });
      t += "</ul>";
      return t;
    case "array":
      return keywords.split(",");
    case "object":
      let r = {};
      keywords.split(",").forEach((k, i) => {
        r[`key${i}`] = k;
      });
      return r;
    default:
      return params;
  }
}
