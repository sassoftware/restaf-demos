# Add custom tool to extend the Assistant

> Set type to "module" in your package.json

## Step 1: Install the library into your application

```cmd
npm install @sassoftware/viya-assistantjs
```

## Step 2: Create a simple nodejs application(assistant.js)

Here is the skeleton code
This is a fully functional chat program

```javascript

import fs from 'fs';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {setupAssistant, runAssistant} from '@sassoftware/viya-assistantjs';

// this import is to get token and host for Viya - created with sas-viya auth login|loginCode
// replace the next two lines to suit your environment
// see this link for the getToken function
import getToken from './getToken.js'; 
let {host, token} = getToken();

// Add another tool 

// Tool specification
let customTools: [
  {
    type: 'function',
    function: {
      name: 'SASCatalog',
      description: `Searches thru SAS Information Catlog for desired information`,
      parameters: {
        properties:{
          information: {
            type: 'string',
            description: `finds the specified information in
                           SAS Catalog`
          }
        }
        type: 'object',
        required: ['information']
      }
    }
  }
];

//handler for the custom tool SASCatalog
async function SASCatalog(params, appEnv) {
  let {information} =  params;
  let r = {
    name: 'SASCatalog',
    params: params,
    notes: 'Add code to do some real work'
  }
  return JSON.stringify(r);
}
let functionList = {
  SASCatalog: SASCatalog
}
// setup configuration
let config = {
  provider: 'openai', 
  model: 'gpt-4-turbo-review', 
  credentials: {
    key: process.env.OPENAI_KEY, // for security get it from environment
    endPoint: null
  },
  assistantid: '0', //let system create a new assistant
  assistantName: "SAS_ASSISTANT",

  threadid: '0', // let system create a new thread

  
  domainTools: {tools: tools, functionList: functionList, instructions: '', replace: false},

  viyaConfig: {
    logonPayload: {
      authType: 'server',
      host: host,  // viya url - https://myviyaserver.acme.com
      token: token,// viya token | null
      tokenType: 'bearer'// if token is specified
      },
    source: 'cas' 
  }  
}

// run a chat session
chat(config)
  .then((r) => console.log('done'))
  .catch((err) => console.log(err));

async function chat(config) {
  //Setup assistant
  let gptControl = await setupAssistant(config);

  // create readline interface and chat with user
  const rl = readline.createInterface({ input, output });

  // process user input in a loop
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
      // run prompt
      let response = await runAssistant(gptControl, prompt,promptInstructions);
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }
}

```

## Step 3: Run the sample app

```cmd
node assistant
```

If source was set to 'cas' or 'compute' you can issue prompts that will use the
 builtin tools. (see the main doc for the default tools). By default you can ask for list of
 several Viya assets:

- list of reports, libraries (caslib or librefs
  - list reports
  - list libs
- for a given libref or caslib get list of tables
  - list tables in public
  - list tables in sashelp
- fetch data from a specified lib and table
  - get data for public.cars. limit to 20

## Peak ahead

In the next example will discuss how to add your own tools.