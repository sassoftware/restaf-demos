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
//import uploadFile from './lib/uploadFile.js';
import 'dotenv/config';

// import { setupAssistant, runAssistant} from './packages/assistant/index.js';
import {setupAssistant, runAssistant, uploadFile} from '../dist/index.module.js';

setupConfig()
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
  let appEnv = await setupViya(process.env.APPENV_SOURCE);

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
      //Note appEnv is passed to runAssistant
      // run assistant will pass both gtpControl and appEnv to tools functions
      let promptInstructions = ' ';
      let response = await runAssistant(gptControl, prompt, promptInstructions,appEnv);
      console.log(response);
    }
  }
   

  return 'assistant session ended';
}
async function setupConfig() {
  let config = {
    provider: process.env.OPENAI_PROVIDER, // openai or azureai 
    model: 'gpt-4-turbo-preview', // pick one of the models 
    credentials: { // credentials from the provider
      openaiKey: process.env.OPENAI_KEY,
      azureaiKey: process.env.OPENAI_AZ_KEY,
      azureaiEndpoint: process.env.OPENAI_AZ_ENDPOINT,
    },
    assistantName: process.env.OPENAI_ASSISTANTNAME, // name of the assistant
    assistantid: process.env.OPENAI_ASSISTANTID,// if you know the assistant id
    threadid: process.env.OPENAI_THREADID,// threadid if you know it. else a new one will be created
    instructions: instructions(),// instructions for the assistant
    domainTools: functionSpecs(),// {tools, functionList} -see provider documentation
    appEnv: null, // this is passed to the domainTools function (see below)
  };

  // In this demo, we are enabling VIYA API calls using @sassoftware/restaf
  // Make sure you have run sas-viya auth login|loginCode
  // APPENV_SOURCE = cas |compute|none
  // ex: cas - will use the cas viya session
  // ex: compute - will use the compute viya session
  // ex: none - will not use viya session
  // ex: cas,compute - sessions for both cas and compute
  
  return config;
  
}
