#!/usr/bin/env node
/*
 * Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from "fs";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import getToken from "./lib/getToken.js";

import {
  setupAssistant,
  runAssistant,
  cancelRun,
  deleteAssistant,
  createFile,
  clearStores,
  clearFiles,
} from "../src/index.js";


// import {setupAssistant, runAssistant, uploadFile} from '../dist/index.module.js';

// setup configuration
let config = setupConfig(process.env.OPENAI_PROVIDER);
// start chat
chat(config)
  .then((r) => console.log("done"))
  .catch((err) => console.log(err));

async function chat(config) {
    let appControl = await setupAssistant(config);

  // create readline interface and chat with user
  const rl = readline.createInterface({ input, output });
  while (true) {
    let prompt = await rl.question(">");
    // exit session
    if (prompt.toLowerCase() === "exit" || prompt.toLowerCase() === "quit") {
      rl.close();
      break;
    }
    prompt = prompt.replace(/\r?\n/g, "");
    let cmda = prompt.toLocaleLowerCase().split(" ");
    let cmd = cmda[0].trim();
    if (cmd === "delete" && cmda[1] === "assistant") {
      cmd = "deleteAssistant"; // delete assistant
    }
    if (cmd === "create" && cmda[1] === "assistant") {
      cmd = "createAssistant"; // create assistant
    }
    
    try {
      switch (cmd) {
        case "upload": {
          // upload file and attach to assistant
          let f = cmda[1].trim();
          console.log(f);
          debugger;
          try {
            //let fileHandle = fs.createReadStream(f); //for openai
            debugger;
            let content = fs.readFileSync(f);
            /*
            let r = await createFile(
              f,
              content,
              "text/plain",
              "assistants",
              appControl
            );
            */
            let r = await appControl.uploadFile(f, content, "text/plain", "assistants");
            console.log(r);
            let vectorStore = await appControl.assistantApi.getVectorStore(appControl.vectorStoreid);
            console.log(vectorStore);
          } catch (e) {
            console.log(e);
          }
          break;
        }
        case "makefile": {
          let filename = cmda[1].trim();
          let content = cmda[2].trim();
          let mimeType = "text/plain";
          let r = await createFile(filename, content, mimeType, appControl);
          console.log(r);
          break;
        }

        case "cancel": {
          //cancel current run
          let a = prompt.split(" ");
          let r = await cancelRun(appControl, a[1], a[2]);
          console.log(r);
          break;
        }
        case "tlist": {
          /*
          let {store} = appControl;
          let payload = {
            url: 'https://api.openai.com/v1/conversations',
            headers: {
              Authorization: 'Bearer ' + config.credentials.key,
            }
          }
          console.log(payload)
          console.log(store.request);
          let r = await store.request(payload);
          console.log(r);
          */
          let r = await appControl.assistantApi.listThreads(config.model);
          console.log(r);

          break;
        }
        case "deleteAssistant": {
          //cancel current run
          let r = await deleteAssistant(appControl, null);
          console.log(r);
          break;
        }
        case "clear": {
          let r = (cmda[1] === "stores") ? await clearStores(appControl) : await clearFiles(appControl);
          console.log(r);
          break;
        }
    
        case "in": {
          console.log(appControl.assistant.instructions);
          break;
        }
        case "show": {
          if (cmda[1] === "assistant") {
             console.log(appControl.assistant);
          } else if (cmda[1] === "thread") {
            console.log(appControl.thread);
          } else if (cmda[1] === "store") {
            let vectorStore = await appControl.assistantApi.getVectorStore(appControl.vectorStoreid);
            console.log(vectorStore);
            let vsFiles = await appControl.assistantApi.listVectorStoresFiles(appControl.vectorStoreid);  
            console.log(vsFiles.data);
            
          } 


          break;
        }
        case "createAssistant": {
          //cancel current run
          appControl = await setupAssistant(config);
          break;
        }
        default: {
          //Note process.env is passed to runAssistant
          // run assistant will pass both appControl and process.env to tools functions
          let promptInstructions = " "; // 'some instructions
          let response = await runAssistant(appControl, prompt, " ");
          console.log(response[0].content);
      
          break;
        }
      }
    } catch (err) {
      console.log(JSON.stringify(err, null, 4));
    }
  }
}

function setupConfig() {
  let config = {
    provider: process.env.APPENV_PROVIDER,
    model: process.env.APPENV_MODEL,
    credentials: {
      key: process.env.APPENV_KEY,
      endPoint: process.env.APPENV_ENDPOINT,
    },
    devMode: process.env.APPENV_DEVMODE === "TRUE",
    assistantid:
      (process.env.ASSISTANTID == null || process.env.APPENV_ASSISTANTID.trim().length === 0)
        ? null
        : process.env.APPENV_ASSISTANTID,
    assistantName: process.env.APPENV_ASSISTANTNAME,
    vectorStoreid: process.env.APPENV_VECTORSTOREID,
    threadid:
      (process.env.APPENV_THREADID == null ||process.env.APPENV_THREADID.trim().length === 0)
        ? null
        : process.env.APPENV_THREADID,
    code: process.env.APPENV_CODE === "TRUE" ? true : false,
    retrieval: process.env.APPENV_RETRIEVAL === "TRUE" ? true : false,
    userData: {},
    pollStatus: process.env.APPENV_POLLSTATUS === 'TRUE',
    pollInterval: (process.env.APPENV_POLLINTERVAL)? parseInt(process.env.APPENV_POLLINTERVAL): 5000
  };
  console.log(config);
  config.domainTools = {
    tools: [],
    functionList: {},
    instructions: "",
    replace: false,
  };
  config.viyaConfig = {};
  let logonPayload = null;
  if (config.devMode === true) {
    config.assistantName= config.assistantName + "_DEV";
  }
  if (process.env.APPENV_VIYA === "TRUE") {
    let { token, host } = getToken();
    logonPayload = {
      authType: "server",
      host: host,
      token: token,
      tokenType: "bearer",
    };
  }
  config.viyaConfig = {
    logonPayload: logonPayload,
    options: {},
  };

  // r.toolSet = 'viya'
  let toolset = process.env.APPENV_TOOLSET
    ? process.env.APPENV_TOOLSET
    : "viya";
  //console.log(toolset);
  // config.domainTools = builtinTools[toolset];
  return config;
}
