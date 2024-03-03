#!/usr/bin/env node
/*
 * Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import inquirer from "inquirer";
import functionSpecs from "./functionSpecs.js";
import instructions from "./instructions.js";
import setupViya from "./lib/setupViya.js";

// import { setupAssistant, runAssistant} from './packages/assistant/index.js';
import {
  setupAssistant,
  runAssistant,
  getMessages,
} from "../dist/index.module.js";
setupSession()
  .then((config) => {
    return run(config);
  })
  .then((r) => {
    console.log(r);
  })
  .catch((err) => {
    console.log(err);
  });

// function to run user's prompt
async function run(config) {
  debugger;
  let gptControl = await setupAssistant(config);
  // setup viya connection
  debugger;
  let appEnv = await setupViya(config.source);

  if (
    process.env.OPENAI_THREADID == null ||
    process.env.OPENAI_THREADID.trim().length === 0
  ) {
    process.env.OPENAI_THREADID = gptControl.threadid;
    console.log(
      "For future use, save this threadid in env OPENAI_THREADID",
      gptControl.threadid
    );
  }
  let questions = {
    type: "input",
    name: "prompt",
    message: ">",
  };

  let quita = ["exit", "quit", "q"];
  while (true) {
    debugger;
    let answer = await inquirer.prompt(questions);
    debugger;
    let prompt = answer.prompt;
    if (quita.includes(prompt.toLowerCase())) {
      break;
    }
    let response = await runAssistant(prompt, gptControl, appEnv);
    console.log(response);
  }

  return "assistant session ended";
}
async function setupSession() {
  console.log("Setup session. CTRL C to exit");


  let questions = [
    {
      type: "list",
      name: "provider",
      // checked: 'openai',
      choices: ["openai", "azureai"],
      message: "Provider(azureai not ready for primetime)",
    },
    {
      type: "input",
      name: "assistantName",
      message: "Assistant name? (default: SAS_ASSISTANT)",
      default() {
        return "SAS_ASSISTANT";
      },
    },
    {
      type: 'list',
      name: 'reuseThread',
      //checked: 'YES',
      choices: ['YES', 'NO'],
      message: 'Reuse previous thread?',
    },
    {
      type: "input",
      name: "model",
      message: "Model? (default: gpt-4-turbo-preview)",
      default() {
        return "gpt-4-turbo-preview";
      },
    },
    {
      type: "list",
      name: "source",
      // checked: 'none',
      choices: ["none", "cas", "compute"],
      message: "Viya server: none, cas, compute",
    },
  ];
  let answers = await inquirer.prompt(questions);
  console.log(answers);

  let tx = (process.env.OPENAI_THREADID == null) ? "0" : process.env.OPENAI_THREADID;
  if (answers.reuseThread === 'NO') {
    console.log(`
    A new thread will be created.
      Recommend saving this new threadid in env OPENAI_THREADID for future use
    `);
  } else if (tx === '0' && answers.reuseThread === 'YES') {
    questions =  [
      { type: 'input',
        name: 'threadid',
        message: `process.env.OPENAI_THREADID is null. Please specify a threadid?`,
      },
    ]
    let tanswers = await inquirer.prompt(questions);
    if (tanswers.threadid.trim().length > 0) {
      tx = tanswers.threadid;
    } else {
      tx = '0';
    }
  };

  answers.threadid =
    process.env.OPENAI_THREADID == null ||
    process.env.OPENAI_THREADID.trim().length == 0
      ? "0"
      : process.env.OPENAI_THREADID;

  answers.threadid = tx;
  answers.reuseThread = answers.reuseThread === 'YES' ? true : false;
  answers.credentials = {
    openaiKey: process.env.OPENAI_KEY,
    azureaiKey: process.env.OPENAI_AZ_KEY,
    azureaiEndpoint: process.env.OPENAI_AZ_ENDPOINT,
  };
  answers.specs = functionSpecs();
  answers.instructions = instructions();

  return answers;
}
