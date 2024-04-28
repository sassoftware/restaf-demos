# @sassoftware/viya-assistantjs - Build your own AI ASSISTANT for SAS Viya

@sassoftware/viya-assistantjs is a light weight JavaScript library to help SAS
users build AI Assistants with minimal coding. This  version supports OpenAI Assistant.

> A note on azureai Assistant support:
 The support for Azureai Assistant is temporarily disabled until azureai
 Assistant is upgraded to use V2 of openai Assistant.

See [documentation here](https://sassoftware.github.io/viya-assistantjs/)

See
<a href="https://platform.openai.com/docs/assistants/how-it-works">how-it-works</a>
for clear explanation of openai Assistant.

## Usage

Install the package using npm

```cmd
npm install @sassoftware/viya-assistantjs
```

In your JavaScript program import the entries.
The documentation is [here](https://sassoftware.github.io/restaf-demos/index.html)

## gpt models

Models used in the development of this library

- openai: gpt-4-turbo-preview

## Basic flow

1. Setup configuration object with information about the provider, model, credentials
2. Create tools or use the builtin tools to satisfy user requests
    - The tools can be simple functions or calls to Viya or other services
    - The tools can be used to satisfy user requests
    - The tools can be used to upload files to the assistant
    - See these links for more examples
      - [Starter tools](https://github.com/sassoftware/restaf-demos/tree/viya-assistantjs/src/builtins/tools/functionWithSpecs)
      - [Samples](https://github.com/sassoftware/restaf-demos/tree/viya-assistantjs-samples)

3. Call the *setupAssistant* method with this information
along with other configuration information.
4. Submit user prompt using the *runAssistant* method
   - The prompt might be resolved by gpt(ex: Who is CEO of SAS Institute)
   - The prompt might request viya-assistantjs to call one of the tools to
   satisfy the request. This is where the rest api call to SAS will happen.
5. Process this response and repeat step 4.
6. Additionally you can use the *uploadFile* method
to upload information to the Assistant for use with the retrieval or
code_interpreter tool.
   - The file uploaded in openai will be added to a vector store

See the two examples for a quick introduction to  this library.

## Tool function signature

The tool function signature used by this library is as follows.

```javascript
async function myToolFunction(params, userData, appControl) {
  // params: parameters passed to the tool from gpt
  // userData: userData set by the developer in the configuration object
  // appControl: returned from setupAssistant
  // return: a string or an object
}
```

> The appControl is the control object of the library - so do not modify
this object.

The appControl object has the following properties that are useful in the tool function:

```javascript
{
  getViyaSession: <function>, // to get viya session information
  uploadFile: <function>,// to upload content to a file
}
```

### getViyaSession

The function takes one argument, the source(cas|sas), and returns an object of
type appEnv.This object has Viya sessionID and other information needed to access
Viya using REST api.

See [this link](https://sassoftware.github.io/restaf-demos/global.html#appEnv)
for details on the appEnv object.

```javascript
let appEnv = await appControl.getViyaSession('cas');
```

### uploadFile

Use this function to upload content to the assistant. in openai, the file is
added to the current vector store and available for file-search.

```javascript
    A sample call is shown below
    let f = await appControl.uploadFile('mydoc.txt', content, 'text/plain', 'assistants');
    Parameters are:
    - mydoc.txt: name of the file to be created
    - content: content to be written to the file
    - mimeType: mime type of the content - see https://platform.openai.com/docs/assistants/tools/file-search/vector-stores
    - purpose: 'assistants' is the only purpose supported at this time
```

## Example 1: Using the builtin tools

The library comes with a a default set of tools to help you get started.
The source code for these tools are available [here](https://github.com/sassoftware/restaf-demos/tree/viya-assistantjs/src/builtins/tools/functionWithSpecs)

The tools are:

- catalogSearch - uses the Information Catalog service to search for information
  - SAS Information Catalog license required. Otherwise it will fail.
- keywords - a simple tool to format comma-separated keywords(used by testing tools)
- listLibrary - list libraries in a cas or sas session
- listTables - list tables in a cas or sas library
- readTable - read a table in a cas or sas library

The sample program is below.

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

```

```javascript
//Step 2: Define the custom tools

let tools = [
  {
    type: 'function',
    function: {
      name: 'myuni',
      description: 'verify the specified course is available for myuni university',
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

async function myuni(params, appEnv) {
  let { course } = params;
  const courseList = ['math', 'science', 'english', 'history', 'art'];
  return (courseList.includes(course) 
    ?  return `${course} is available`
    :  return `${course} is not available`);
}
```

```javascript
// Step 3: setup configuration, Use the tools defined above
let config = {
  devMode: true,
  provider: 'openai',
  model: process.env.OPENAI_MODEL,
  temperature: 0.5, 
  credentials: {
    key: process.env.OPENAI_KEY, // obtain from provider
  },
  assistantid: null //create a new assistant
  assistantName: "SAS_ASSISTANT",
  threadid: null,
  vectorStoreid: null,
  domainTools:  {tools: tools, functionList: {myuni}, instructions: 'Assistant for myUniverity'},
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
would not use AI Assistant for this purpose. However, this example demonstrates
the basics of calling Viya to respond to a user query.

This example uses @sassoftware/restafedit to make the API calls. You can
use other ways to call Viya and get responses.

Some key points:

1. The viyaConfig object is used to pass the host and token information to the
   assistant. This is used to logon to Viya.
2. The getViyaSession method is used to get the session information for the
   assistant to call Viya.

```javascript
// Step 1: Import the necessary modules
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import getToken from "./getToken.js";
import { setupAssistant, runAssistant } from "@sassoftware/viya-assistantjs";
let { host, token } = getToken();
```

```javascript
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
async function listTables(params, userData, appControl) {
  let { library, source, start, limit } = params;
  // get session information (source is either cas or sas|compute)
  let appEnv = await appControl.getViyaSession(source);

  // limit the number of tables to return
  let p = {
    qs: {
      limit: limit == null ? 10 : limit,
      start: start == null ? 0 : start,
    },
  };

  // get the list of libs for the selected source
  // see https://sassoftwares.github.io/restaf for information on restafedit
  let r = await appEnv.restafedit.getTableList(library, appEnv, p);
  return JSON.stringify(r);
}
```

```javascript
// Step 3: setup configuration
let config = {
  devMode: true,
  provider: "openai", 
  model: process.env.OPENAI_MODEL,
  credentials: {
    key: process.env.OPENAI_KEY, // obtain from provider
  },
  assistantid: null, //create a new assistant
  assistantName: "SAS_ASSISTANT",

  threadid: null, //create a new thread
  vectorStoreid: null, //create a new vector store
  domainTools: {
    tools: tools,
    functionList: { listTables },
    instructions: "Assistant to list the tables in a sas or cas library",
  },
  viyaConfig: {
    logonPayload: {
      authType: "server",
      host: host,
      token: token,
      tokenType: "bearer",
    },
  },
  userData: {}, // your data to be passed on to the tools
};
```

```javascript
// run a chat session
chat(config)
  .then((r) => console.log("done"))
  .catch((err) => console.log(err));

async function chat(config) {
  //Setup assistant
  let appControl = await setupAssistant(config);

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
      let response = await runAssistant(appControl, prompt, promptInstructions);
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

Please let me know if you need details on any of these tables or if there's
anything else I can assist you with.

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

Please let me know if you need information on any of these tables or if there's
 anything else I can assist you with.
