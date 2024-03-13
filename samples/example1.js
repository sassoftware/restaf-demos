
import fs from 'fs';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {setupAssistant, runAssistant} from '@sassoftware/viya-assistantjs';

// this import is to get token and host for Viya
// replace the next two lines to suit your environment
import getToken from './lib/getToken.js'; 

// setup configuration
let config = {
  provider: 'openai' // or 'azureai';
  model: 'gpt-4-turbo-review', // or 'gpt-3-turbo-review'
  credentials: {
    key: key, // from the provider
    endPoint: <for azureai only>
  },
  assistantid: '0', //let system create a new assistant
  assistantName: <give the assistant a name >',

  threadid: '0', // let system create a new thread
  domainTools: {tools: [], functionList: {}, instructions: '', replace: false},
  viyaConfig: {
    logonPayload: {
      authType: 'server',
      host: host,  // viya url - https://myviyaserver.acme.com
      token: token,// viya token | null
      tokenType: 'bearer'// if token is specified
      }
    source: 'cas' 
  }  
}

// run a chat session
chat(config)
  .then((r) => console.log('done'))
  .catch((err) => console.log(err));

async function chat(config) {
  let gptControl = await setupAssistant(config);

  // create readline interface and chat with user
  const rl = readline.createInterface({ input, output });

  // process user input
  while (true) {
    let prompt = await rl.question('>');
    // exit session
    if (prompt.toLowerCase() === 'exit' || prompt.toLowerCase() === 'quit') {
      rl.close();
      break;
    }
    // let assistant process the prompt
    let promptInstructions = ' ';
    try {
      let response = await runAssistant(gptControl, prompt,promptInstructions);
      console.log(response);
    } catch (err) {
      console.log(err);
    }
    break;
  }
}
