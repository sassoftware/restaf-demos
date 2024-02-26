#!/usr/bin/env node
/*
 * Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import inquirer from 'inquirer';
import functionSpecs from './gptFunctions/functionSpecs.js';
import { setupAssistant, runAssistant} from './packages/assistant/index.js';
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

async function run(config) {
  let {gptControl, appEnv} = await setupAssistant(config);
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
  } 

  return "assistant session ended";
}
async function setupSession() {
  console.log('Setup session. CTRL C to exit');
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
    /*
    {
      type: 'list',
      name: 'reuseThread',
      //checked: 'YES',
      choices: ['YES', 'NO'],
      message: 'Reuse previous thread?',
    },
    */
    {
      type: 'boolean',
      name: 'reuseThread',
      checked: true,
     // choices: ['YES', 'NO'],
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
  console.log('answers', answers);
  answers.credentials = {
    openaiKey: process.env.OPENAI_KEY,
    azureaiKey: process.env.OPENAI_AZ_KEY,
    azureaiEndpoint: process.env.OPENAI_AZ_ENDPOINT
  }
  answers.specs = functionSpecs();
  return answers;
}

