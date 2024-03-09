#!/usr/bin/env node
/*
 * Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import getToken from './lib/getToken.js';
import {setupAssistant, runAssistant} from '../src/index.js';

// See examples/lib/getToken.js on how getToken is implemented
// Feel free to use your own way of acquiring the token and host
let {token, host} = getToken();  
logonPayload = {
  authType: 'server',
  host: host,
  token: token,
  tokenType: 'bearer'
}
// to use compute server set source to 'compute'
// userData is for you to pass data to the assistant tool functions
let viyaConfig = {logonPayload: logonPayload, source: 'cas', userData:{}};

let config = {
  provider: process.env.OPENAI_PROVIDER, // openai|azureai
  model: 'gpt-4-turbo-preview',  
  credentials: {
    key: process.env.OPENAI_KEY, // get this from openai
  },
  assistantid: '0',// set this if you know the id of the assistant you want to use
  assistantName: process.env.OPENAI_ASSISTANTNAME,// or specify the name of the assistant
  threadid: process.env.OPENAI_THREADID,// specify thread id if you want to use an existing thread
  domainTools: { // add your tools here if you want to extend the default tools
    tools: [],  // add your tools here
    functionList: {}, // add your functions here
    instructions: '' // add your instructions here
  },
  viyaConfig: viyaConfig
}

run(config) 
  .then(r => {
    console.log(r);
  })
  .catch(err => {
    console.log(err);
  });

// function to run user's prompt
async function run(config) {
  let gptControl = await setupAssistant(config);
  let prompt = 'fetch data from cars in public';
  let promptInstructions = ' ';
  let response = await runAssistant(gptControl, prompt, promptInstructions);
  return response;
  }
   

