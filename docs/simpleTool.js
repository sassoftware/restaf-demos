// Step 1: Import the necessary modules
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import getToken from './getToken.js';
import {setupAssistant, runAssistant} from '@sassoftware/viya-assistantjs';
let {host, token} = getToken();
//getToken is defined at the end of the program below

//Step 2: Define the custom tools

let tools = [
  {
    type: 'function',
    function: {
      name: 'myuniversity',
      description: 'verify the specified course is available in myuniversity',
      parameters: {
        properties: {
          course: {
              type: 'string',
              description: 'the name of the course',
            },
          },
          type: 'object',
          required: ['course'],
        },
      },
  },
];

async function myuniversity(params, appEnv) {
  let { course } = params;
  const courseList = ['math', 'science', 'english', 'history', 'art'];
  if (courseList.includes(course)) {
    return `${course} is available`;
  } else {
    return `${course} is not available`;
  }
}

// Step 2: setup configuration
let config = {
  devMode: true,
  provider: 'openai',// or 'azureai'
  model: process.env.OPENAI_MODEL, 
  credentials: {
    key: process.env.OPENAI_KEY, // obtain from provider
  },
  assistantid: null, //create a new assistant
  assistantName: "SAS_ASSISTANT",

  threadid: null,
  vectorStoreid: null,
  domainTools:  {tools: tools, functionList: {myuniversity}, instructions: 'Assistant for myUniverity'},
  viyaConfig: {
    logonPayload: null
  },
  userData: {}
}

// run a chat session
chat(config)
  .then((r) => console.log('done'))
  .catch((err) => console.log(err));

async function chat(config) {
  //Setup assistant
  let appControl = await setupAssistant(config);

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
      let response = await runAssistant(appControl, prompt,promptInstructions);
      console.log(response[0].content);
    } catch (err) {
      console.log(err);
    }
  }
}
