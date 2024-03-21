#!/usr/bin/env node
/*
 * Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import 'dotenv/config';
import getToken from './lib/getToken.js';

import {
  setupAssistant,
  runAssistant,
  cancelRun,
  deleteAssistant,
  uploadFile,
} from '../src/index.js';

// import {setupAssistant, runAssistant, uploadFile} from '../dist/index.module.js';

// setup configuration
let config = setupConfig(process.env.OPENAI_PROVIDER);
chat(config)
  .then((r) => console.log('done'))
  .catch((err) => console.log(err));

async function chat(config) {
  let gptControl = await setupAssistant(config);
 

  // create readline interface and chat with user
  const rl = readline.createInterface({ input, output });
  while (true) {
    let prompt = await rl.question('>');
    // exit session
    if (prompt.toLowerCase() === 'exit' || prompt.toLowerCase() === 'quit') {
      rl.close();
      break;
    }
    prompt = prompt.replace( /\r?\n/g, '' );
    let cmda = prompt.toLocaleLowerCase().split(' ');
    let cmd = cmda[0].trim();
    if (cmd === 'delete' && cmda[1] === 'assistant') {
      cmd = 'deleteAssistant'; // delete assistant
    }
    if (cmd === 'create' && cmda[1] === 'assistant') {
      cmd = 'createAssistant'; // create assistant
    }
    try {
      switch (cmd) {
        case 'upload': {
          // upload file and attach to assistant
          let f = cmda[1].trim();
          console.log(f);
          debugger;
          try {
            let fileHandle = fs.createReadStream(f); //for openai
            debugger;
            let content = fs.readFileSync(f); //for azureai
            let r = await uploadFile(f,fileHandle, content, 'assistants', gptControl);
            console.log(r);
          }
          catch (e) {
            console.log(e);
          } 
          break;
        }
        case 'cancel': {
          //cancel current run
          let a = prompt.split(' ');
          let r = await cancelRun(gptControl, a[1], a[2]);
          console.log(r);
          break;
        }
        case 'deleteAssistant': {
          //cancel current run
          let r = await deleteAssistant(gptControl, null);
          console.log(r);
          break;
        }
        case 'in': {
          console.log(gptControl.assistant.instructions);
          break;
        }
        case 'showast': {
          console.log(gptControl.assistant);
          break;
        }
        case 'createAssistant': {
          //cancel current run
          gptControl = await setupAssistant(config);
          break;
        }
        default: {
          //Note process.env is passed to runAssistant
          // run assistant will pass both gtpControl and process.env to tools functions
          let promptInstructions = 'Format the message as html';
          let response = await runAssistant(
            gptControl,
            prompt,
            promptInstructions
          );
          console.log(response);
          break;
        }
      }
    } catch (err) {
      console.log(JSON.stringify(err, null, 4));
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
      assistantid: 'NEW',
      assistantName: process.env.OPENAI_ASSISTANTNAME,
      threadid: 'NEW', //process.env.OPENAI_THREADID,
      code: true,
      retrieval: true,
    },
    azureai: {
      provider: process.env.OPENAI_PROVIDER,
      model: process.env.AZUREAI_MODEL,
      credentials: {
        key: process.env.AZUREAI_KEY,
        endPoint: process.env.AZUREAI_ENDPOINT,
      },
      assistantid: 'NEW',
      assistantName: process.env.AZUREAI_ASSISTANTNAME,
      threadid: 'NEW', // process.env.AZUREAI_THREADID,
      logLevel: null,
      code: true,
      retrieval: false,
    },
  };
  let r = config[provider];
  r.domainTools = {
    tools: [],
    functionList: {},
    instructions: '',
    replace: false,
  };
  r.viyaConfig = null;
  if (process.env.APPENV_SOURCE != null) {
    let { token, host } = getToken();
    let logonPayload = {
      authType: 'server',
      host: host,
      token: token,
      tokenType: 'bearer',
    };
    r.viyaConfig = {
      logonPayload: logonPayload,
      source: process.env.APPENV_SOURCE,
    };
  }
  return r;
}
