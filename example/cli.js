#!/usr/bin/env node
/*
 * Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import inquirer from 'inquirer';
import functionSpecs from './functionSpecs.js';
import instructions from './instructions.js';
import setupViya from './lib/setupViya.js';

// import { setupAssistant, runAssistant} from './packages/assistant/index.js';
import { setupAssistant, runAssistant, getMessages} from '../dist/index.module.js';
setupSession()
  .then((config) => {
    return run(config);
  })
  .then ((r) => {
    console.log(r)
  })
  .catch((err) => {
    console.log(err);
  });

// function to run user's prompt
async function run(config) {
  let gptControl = await setupAssistant(config);
  // setup viya connection
  let appEnv = await setupViya(config.source);

  if (process.env.OPENAI_THREADID == null || process.env.OPENAI_THREADID.trim().length === 0) {
    process.env.OPENAI_THREADID=gptControl.threadid;
    console.log('For future use, save this threadid in env OPENAI_THREADID', gptControl.threadid)
  }
  let questions = {
    type: 'input',
    name: 'prompt',
    message: '>'
  }

  let quita = ['exit', 'quit', 'q'];
  while (true) {
    let answer = await inquirer.prompt(questions);
    let prompt = answer.prompt;
    if (quita.includes(prompt.toLowerCase())){ 
      break;
    }
    let response = await runAssistant(prompt, gptControl, appEnv);
    console.log(response);
    let messages = await getMessages(gptControl, 5);
    console.log(messages);
  } 

  return "assistant session ended";
}
async function setupSession() {
  console.log('Setup session. CTRL C to exit');
  
  let threadMessage = (process.env.OPENAI_THREADID == null || process.env.OPENAI_THREADID.trim().length === 0) ?
                       `true to reuse` : `if true, will use  env=${process.env.OPENAI_THREADID}`;
  

  let questions = [
    {
      type: 'list',
      name: 'provider',
      // checked: 'openai',
      choices: ['openai', 'azureai'],
      message: 'Provider(azureai not ready for primetime)'
    },
    {
      type: 'input',
      name: 'assistantName',
      message: 'Assistant name? (default: SAS_ASSISTANT)',
      default() {
        return 'SAS_ASSISTANT';
      },
    },
    {
      type: 'input',
      name: 'model',
      message: 'Model? (default: gpt-4-turbo-preview)',
      default() {
        return 'gpt-4-turbo-preview'
      },
    },
    {
      type: 'boolean',
      name: 'reuseThread',
      checked: true,
      message: threadMessage,
      default() {
        return true;
      }
    },
    
    {
      type: 'list',
      name: 'reuseThread',
      choices: ['YES', 'NO', ],
      message: 'Reuse previous thread?(true/false)',
      default() {
        return true;
      }
    },
    {
      type: 'list',
      name: 'source',
      // checked: 'none',
      choices: ['none', 'cas', 'compute'],
      message: 'Viya server: none, cas, compute',
    },
  ];
  let answers = await inquirer.prompt(questions);
  answers.threadid = (process.env.OPENAI_THREADID == null || process.env.OPENAI_THREADID.trim().length == 0) ? '0' : process.env.OPENAI_THREADID;
  console.log('answers', answers);
  answers.credentials = {
    openaiKey: process.env.OPENAI_KEY,
    azureaiKey: process.env.OPENAI_AZ_KEY,
    azureaiEndpoint: process.env.OPENAI_AZ_ENDPOINT
  }
  answers.specs = functionSpecs();
  answers.instructions = instructions();
  console.log('answers', answers);
  return answers;
}

