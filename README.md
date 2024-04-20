# @sassoftware/viya-assistantjs - Build your own AI ASSISTANT for SAS Viya

@sassoftware/viya-assistantjs is a light weight JavaScript library to help SAS
users build AI Assistants with minimal coding. It uses the Assistant from openai and
azureai(based on configuration).

See
<a href="https://platform.openai.com/docs/assistants/how-it-works">how-it-work</a>
for clear explanation of openai Assistant.

## gpt models

Models used in the development of this library

- openai: gpt-4-turbo-preview
- azureai: gpt-4 1106 preview in zone East US 2

## Basic flow

1. Setup configuration object with information about the provider, model, credentials
2. Create tools or use the builtin tools to satisfy user requests
3. Call the *setupAssistant* method with this information
along with other configuration information.
4. Submit user prompt using the *runAssistant* method
   - The prompt might be resolved by gpt(ex: Who is CEO of SAS Institute)
   - The prompt might request viya-assistantjs to call one of the tools to
   satisfy the request. This is where the rest api call to SAS will happen.
5. Process this response and repeat step 4.
6. Additionally you can use the *uploadFile* method
to upload information to the Assistant for use with the retrieval or
code_interpreter tool

## Example 1: Creating a AI Assistant with a simple custom tool<a name="default"></a>

See notes in the program below

```javascript

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
      description: 'verify the specified course is available',
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

// Step 2: setup configuration, Use the tools defined above
let config = {
  provider: 'openai',// or 'azureai'
  model: process.env.OPENAI_MODEL, 
  credentials: {
    key: process.env.OPENAI_KEY, // obtain from provider
  },
  assistantid: 'NEW', //create a new assistant
  assistantName: "SAS_ASSISTANT",

  threadid: 'NEW',
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
      console.log(response[0].content);
    } catch (err) {
      console.log(err);
    }
  }
}

## Run the program

```cmd
node index.js
```

If everthing was setup properly, your should get a prompt(>). Enter your prompts
and get results.

### Sample prompts for Example1

Prompt: can I take a math course?
Response: Yes, you can take the Math course at myUniversity as it is available.

Prompt: can I take courses on Dune?
Response: The course in "Dune" is not available at the university.

Prompt: can I take course in math, physics and chemistry?
Response: Here are the availability statuses for the courses you inquired about:

- Math: Available
- Physics: Not available
- Chemistry: Not available

---

## Creating a AI Assistant with a Viya-based tool<a name="extend"></a>

This example has a tool to list tables in a given caslib or libref. Clearly one
would not use AI Assistant for this purpose. However this example demonstrates how to 
include "corporate" or "private" information to resolve the prompt.

This example uses @sassoftware/restafedit to make the API calls. You can
use other ways to call Viya and get responses.

```javascript
// Step 1: Import the necessary modules
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import getToken from "./getToken.js";
import { setupAssistant, runAssistant } from "@sassoftware/viya-assistantjs";
let { host, token } = getToken();

//Step 2: Define the custom tools

const tools = [
  {
    type: "function",
    function: {
      name: "listTables",
      description: `for a given library for  either sas or cas source, get the list of available tables.
      (ex: list tables in cas library samples, list tables in sas library sashelp)
      Optionally let user specify the source as cas or compute.`,
      parameters: {
        properties: {
          library: {
            type: "string",
            description: "A SAS library like casuser, sashelp, samples",
          },
          start: {
            type: "integer",
            description: "Start at lookup at this index. Default is 0.",
          },
          limit: {
            type: "integer",
            description:
              "Return only this many tables. If not specified, then return 10 tables.",
          },
          source: {
            type: "string",
            description: "The source of the data. cas or compute",
            enum: ["cas", "compute"],
          },
        },
        type: "object",
        required: ["library"],
      },
    },
  },
];
async function listTables(params, userData, gptControl) {
  let { library, source, start, limit } = params;
  // get session information
  let appEnv = await gptControl.viyaOnDemand(gptControl, source);
  let p = {
    qs: {
      limit: limit == null ? 10 : limit,
      start: start == null ? 0 : start,
    },
  };

  // get the list of libs for the selected source
  let r = await appEnv.restafedit.getTableList(library, appEnv, p);
  return JSON.stringify(r);
}
// Step 2: setup configuration
let config = {
  provider: "openai", // or 'azureai'
  model: process.env.OPENAI_MODEL,
  credentials: {
    key: process.env.OPENAI_KEY, // obtain from provider
  },
  assistantid: "NEW", //create a new assistant
  assistantName: "SAS_ASSISTANT",

  threadid: "NEW", //create a new thread
  domainTools: {
    tools: tools,
    functionList: { listTables },
    instructions: "Assistant for myUniverity",
  },
  viyaConfig: {
    logonPayload: {
      authType: "server",
      host: host,
      token: token,
      tokenType: "bearer",
    },
  },
  userData: {},
};

// run a chat session
chat(config)
  .then((r) => console.log("done"))
  .catch((err) => console.log(err));

async function chat(config) {
  //Setup assistant
  let gptControl = await setupAssistant(config);

  // create readline interface and chat with user
  const rl = readline.createInterface({ input, output });

  // process user input in a loop
  while (true) {
    let prompt = await rl.question(">");
    // exit session
    if (prompt.toLowerCase() === "exit" || prompt.toLowerCase() === "quit") {
      rl.close();
      break;
    }
    // let assistant process the prompt
    let promptInstructions = " ";
    try {
      // run prompt
      let response = await runAssistant(gptControl, prompt, promptInstructions);
      console.log(response[0].content);
    } catch (err) {
      console.log(err);
    }
  }
}
  
```

## Sample prompts and responses

Prompt: list sas tables in sashelp
Response: Here are the tables available in the SAS library named "sashelp":

1. `AACOMP`
2. `AARFM`
3. `ADSMSG`
4. `AFMSG`
5. `AIR`
6. `AIRLINE`
7. `AIRSHIFT`
8. `AMLMSG`
9. `APPLIANC`
10. `ARSTOP`

Please let me know if you need details on any of these tables or if there's anything else I can assist you with.

Prompt: list tables in cas library Public
Response:Here are the tables available in the CAS library named "Public":

1. `CARS`
2. `STUDENTS_TRAIN`
3. `HEART_DISEASE`
4. `BREASTSDG`
5. `ADULT_TRAIN`
6. `ADULT_TEST`
7. `CMS_OPIOID_SDOH`
8. `BANKING`
9. `STUDENTS_TEST`
10. `BIKE_SHARING_DEMAND`

Please let me know if you need information on any of these tables or if there's anything else I can assist you with.
