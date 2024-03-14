
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {setupAssistant, runAssistant} from '@sassoftware/viya-assistantjs';

// this import is to get token and host for Viya - created with sas-viya auth login|loginCode
// replace the next two lines to suit your environment
// see this link <https://github.com/sassoftware/restaf-demos/blob/viya-assistantjs/example/lib/getToken.js> for the getToken function
import getToken from './getToken.js'; 
let {host, token} = getToken();

// Add another tool 

// Tool specification
let customTools = [
  {
    type: 'function',
    function: {
      name: 'runSASLocalFile',
      description:
        'run the specified file. The file is a path to the sas program',
      parameters: {
        properties: {
          file: {
            type: 'string',
            description: 'this is the file to run',
          },
        },
        type: 'object',
        required: ['file'],
      }
    }
  }
];

//handler running sas code from a local file
async function runSASLocalFile(params, appEnv) {
  let { file } = params;
  let { store, session } = appEnv;
  let src;
  try {
    src = await fss.readFile(file, "utf8");
  } catch (err) {
    console.log(err);
    return "Error reading file " + file;
  }

  if (appEnv.source === "cas") {
    let r = await caslRun(store, session, src, {}, true);
    return JSON.stringify(r.results);
  } else {
    let computeSummary = await computeRun(store, session, src);
    let log = await computeResults(store, computeSummary, "log");
    return logAsArray(log);
  }
}

let functionList = {
  runSASFile: runSASFile
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
