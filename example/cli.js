#!/usr/bin/env node
/*
 * Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import inquirer from 'inquirer';
import fs from 'fs';
import functionSpecs from './functionSpecs.js';
import instructions from './instructions.js';
import setupViya from './lib/setupViya.js';
import getToken from './lib/getToken.js';

import 'dotenv/config';

// import { setupAssistant, runAssistant} from './packages/assistant/index.js';
import {setupAssistant, runAssistant, uploadFile} from '../dist/index.module.js';

setupConfig('openai')
  .then (config => {
    run(config); 
  })
  .catch(err => {
    console.log(err);
  });

// function to run user's prompt
async function run(config) {
  debugger;
  let gptControl = await setupAssistant(config);
  // creating application data.(optional) 
  // 
  let logonPayload = null;
  let source =(process.env.VIYASOURCE == null|| process.env.VIYASOURCE.trim().length ===0) ? 'none' : process.env.VIYASOURCE; 

  if (process.env.VIYASOURCE != null) {
    let {token, host} = getToken();
    logonPayload = {
      authType: 'server',
      host: host,
      token: token,
      tokenType: 'bearer'
    }
  }

  let appEnv = await setupViya(source, logonPayload);

  console.log('--------------------------------------');
  console.log('Assistant: ', gptControl.assistant.name,   gptControl.assistant.id); 
  console.log('Thread: ', gptControl.thread.id);
  console.log('--------------------------------------');

  let questions = {
    type: 'input',
    name: 'prompt',
    message: '>',
  };

  let quita = ['exit', 'quit', 'q'];
  while (true) {
    debugger;
    let answer = await inquirer.prompt(questions);
    debugger;
    let prompt = answer.prompt;
    if (quita.includes(prompt.toLowerCase())) {
      break;
    }
    if (prompt.substring(0, 1) === '!') {
      let f = prompt.substring(1).trim();
      let fileHandle = fs.createReadStream(f);
      let r = await uploadFile(fileHandle,"assistants", gptControl)
      console.log(r);
    } else {
      //Note process.env is passed to runAssistant
      // run assistant will pass both gtpControl and process.env to tools functions
      let promptInstructions = ' ';
      try {
        let response = await runAssistant(gptControl, prompt, promptInstructions,appEnv);
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    }
  }
   

  return 'assistant session ended';
}
async function setupConfig(provider) {
  let config = {
    openai: {
      provider: process.env.OPENAI_PROVIDER,
      model: process.env.OPENAI_MODEL,
      credentials: {
        key: process.env.OPENAI_KEY,
      },
      assistantid: process.env.OPENAI_ASSISTANTID,
      assistantName: process.env.OPENAI_ASSISTANTNAME,
      threadid: process.env.OPENAI_THREADID
    },
    azureai: {
      provider: process.env.AZUREAI_PROVIDER,
      model: process.env.AZUREAI_MODEL,
      credentials: {
        key: process.env.AZUREAI_KEY,
        endPoint: process.env.AZUREAI_ENDPOINT
      },
      assistantid: process.env.AZUREAI_ASSISTANTID,
      assistantName: process.env.AZUREAI_ASSISTANTNAME,
      threadid: process.env.AZUREAI_THREADID
    }
  };
  let r = config[provider];
  r.instructions = instructions();
  r.domainTools = functionSpecs();
  return r;
}

// In this demo, we are enabling VIYA API calls using @sassoftware/restaf
// Make sure you have run sas-viya auth login|loginCode
// process.env_SOURCE = cas |compute|none
// ex: cas - will use the cas viya session
// ex: compute - will use the compute viya session
// ex: none - will not use viya session
// ex: cas,compute - sessions for both cas and compute
  