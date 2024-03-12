# A nodejs starter library to help SAS users build ASSISTANTS

## Works with openai Assistant api and azureai Assistant api

## Install the library into your application

```cmd
npm install @sassoftware/openai-assistantjs

Then import the following two entries in your nodejs code

import {setupAssistant, runAssistant} from '@sassoftware/viya-assistantjs';

```

## Sample program

This is a fully functional chat program

```javascript

import fs from 'fs';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import 'dotenv/config';
import getToken from './lib/getToken.js';
import {setupAssistant, runAssistant} from '@sassoftware/viya-assistantjs';

// setup configuration
let config = setupConfig(process.env.OPENAI_PROVIDER);

// extend or replace with your own tools
config.domainTools = {
    tools: [], functionList: {}, instructions: '', replace: false,
};

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

// a reusable function to setup the configuration
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
      threadid: process.env.OPENAI_THREADID,
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
      threadid: '0', //process.env.AZUREAI_THREADID
    },
  };
  let r = config[provider];
 
  r.viyaConfig = null;
  if (process.env.VIYASOURCE != null) {
    let { token, host } = getToken();
    let logonPayload = {
      authType: 'server',
      host: host,
      token: token,
      tokenType: 'bearer',
    };
    r.viyaConfig = {
      logonPayload: logonPayload,
      source: process.env.VIYASOURCE,
    };
  }
  return r;
}

```

Useful links:

[openai Assistant Documentation](https://platform.openai.com/docs/assistants/overview)
[azureai Assistant Documentation] (https://learn.microsoft.com/en-us/javascript/api/overview/azure/openai-assistants-readme?view=azure-node-preview)

## Import

- Install the library @sassoftware/openai-assistantjs@latest
- Import the two entry points as follows:

```javascript
import { setupAssistant, runAssistant} from '@sassoftware/openai-assistantjs';
```

### Config object

The example below sets the values from environment variables.
You can set these directly also.

```javascript
let config = {
  provider: process.env.OPENAI_PROVIDER, 
  model: 'gpt-4-0125-preview', // change this to your perference
  credentials: { // credentials from the provider- recommend using env vaiables
    key: process.env.OPENAI_KEY,
    endpoint: process.env.OPENAI_AZ_ENDPOINT, // required for azureai
  },
  assistantName: process.env.OPENAI_ASSISTANTNAME, // name of the assistant
  assistantid: process.env.OPENAI_ASSISTANTID|0,// if you know the assistant id
  threadid: process.env.OPENAI_THREADID '0,// threadid if you know it. else a new one will be created
  instructions: ,// instructions for the assistant
  domainTools: {
    tools: <see provider documentation>
    functionList: {nameoffunction: function, ...}
    instructions: <string with instructions for the assistant>
    replace: false, // append this to default tools or replace them
  }
}
```
