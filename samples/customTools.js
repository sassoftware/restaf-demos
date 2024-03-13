
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
let customTools = [
  {
    type: 'function',
    function: {
      name: 'SASCatalog',
      description: `get specifiied metadata from SAS Catalog Manager Information Catlog`,
      parameters: {
        properties:{
          metadata: {
            type: 'string',
            description: `finds the specified metadata in SAS Catalog`,
            enum: ['tags','catalogStatistics','indices']
          }
        },
        type: 'object',
        required: ['information']
      }
    }
  }
];

//handler for the custom tool SASCatalog
async function SASCatalog(params, appEnv) {
  let {metadata} =  params;
  let {store} = appEnv;
  console.log(metadata);
  let {catalog} = await store.addServices('catalog');
  try {
    debuggger;
    let result = await store.apiCall(catalog(metadata));
    console.log('---',result.items().toJS());
    return JSON.stringify(result.items().toJS());
    } 
  catch (err) {
    debugger;
    return JSON.stringify(err);
  }
}

let functionList = {
  SASCatalog: SASCatalog
}

let instructions = 
  `You are an assistant to help users seach thru the SAS Information Catalog for metadata.
  They can then use this information to do futher analysis`;

 
// setup configuration
let config = {
  provider: 'openai', 
  model: 'gpt-4-turbo-preview', 
  credentials: {
    key: process.env.OPENAI_KEY, // for security get it from environment
    endPoint: null
  },
  assistantid: '0', //let system create a new assistant
  assistantName: "SAS_ASSISTANT_EXTEND",
  threadid: '0', // let system create a new thread
  domainTools: {tools: customTools, functionList: functionList, instructions: instructions, replace: false},

  viyaConfig: {
    logonPayload: {
      authType: 'server',
      host: host,  // viya url - https://myviyaserver.acme.com
      token: token,// viya token | null
      tokenType: 'bearer'// if token is specified
      },
    source: 'none' 
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
