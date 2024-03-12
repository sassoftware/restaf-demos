#!/usr/bin/env node
/*
 * Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from "fs";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import "dotenv/config";
import getToken from "./lib/getToken.js";
import {setupAssistant, runAssistant, cancelRun, uploadFile} from "../src/index.js";

// import {setupAssistant, runAssistant, uploadFile} from '../dist/index.module.js';

// setup configuration
let config = setupConfig(process.env.OPENAI_PROVIDER);
console.log("-------------------------------------------------");
console.log("Configuration: ", config);
console.log("-------------------------------------------------");

chat(config)
  .then((r) => console.log("done"))
  .catch((err) => console.log(err));

async function chat(config) {
  let gptControl = await setupAssistant(config);
  console.log("--------------------------------------");
  console.log("Current session:");
  console.log("Provider: ", gptControl.provider);
  console.log("Model: ", gptControl.model); 
  console.log(
    "Assistant: ",
    gptControl.assistant.name,
    "Assistant id",
    gptControl.assistant.id
  );
  console.log("Threadid: ", gptControl.thread.id);
  console.log('Viya Source:', gptControl.appEnv.source);
  console.log("--------------------------------------");

  // create readline interface and chat with user
  const rl = readline.createInterface({ input, output });
  while (true) {
    let prompt = await rl.question(">");
    // exit session
    if (prompt.toLowerCase() === "exit" || prompt.toLowerCase() === "quit") {
      rl.close();
      break;
    }
    let cmd = prompt.split(" ")[0].toLowerCase();

    switch (cmd) {
      case "<": {
        // upload file and attach to assistant
        let f = prompt.substring(1).trim();
        let fileHandle = fs.createReadStream(f);
        let r = await uploadFile(fileHandle, "assistants", gptControl);
        console.log(r);
        break;
      }
      case "cancel": {
        //cancel current run
        let a = prompt.split(" ");
        let r = await cancelRun(gptControl, a[1], a[2]);
        console.log(r);
        break;
      }
      default: {
        //Note process.env is passed to runAssistant
        // run assistant will pass both gtpControl and process.env to tools functions
        let promptInstructions = " ";
        try {
          let response = await runAssistant(
            gptControl,
            prompt,
            promptInstructions
          );
          console.log(response);
        } catch (err) {
          console.log(err);
        }
        break;
      }
    }
  }
}

function setupConfig(provider) {
  let config = {
    openai: {
      provider: process.env.OPENAI_PROVIDER,
      model: process.env.OPENAI_MODEL,
      credentials: {
        key: process.env.OPENAI_KEY,
      },
      assistantid: process.env.OPENAI_ASSISTANTID,
      assistantName: process.env.OPENAI_ASSISTANTNAME,
      threadid: 'thread_BjcI5VNc8fnsKaKo0I1B9DeM' //process.env.OPENAI_THREADID,
    },
    azureai: {
      provider: process.env.OPENAI_PROVIDER,
      model: process.env.AZUREAI_MODEL,
      credentials: {
        key: process.env.AZUREAI_KEY,
        endPoint: process.env.AZUREAI_ENDPOINT,
      },
      assistantid: process.env.AZUREAI_ASSISTANTID,
      assistantName: process.env.AZUREAI_ASSISTANTNAME,
      threadid: '0', // process.env.AZUREAI_THREADID,
      logLevel: null
    },
  };
  let r = config[provider];
  r.domainTools = {
    tools: [],
    functionList: {},
    instructions: "",
    replace: false,
  };
  r.viyaConfig = null;
  if (process.env.APPENV_SOURCE != null) {
    let { token, host } = getToken();
    let logonPayload = {
      authType: "server",
      host: host,
      token: token,
      tokenType: "bearer",
    };
    r.viyaConfig = {
      logonPayload: logonPayload,
      source: 'none' //process.env.APPENV_SOURCE,
    };
  }
  return r;
}
