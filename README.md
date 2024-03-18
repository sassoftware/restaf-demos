# @sassoftware/viya-assistantjs - Build your own AI ASSISTANT for SAS Viya

## Introduction to azure and openai Assistant API

There are many resources available. This site from Microsoft is a good place to start
<a href="https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/assistants?source=recommendations">Getting started with Azure OpenAI Assistants (Preview)</a>
---

## gpt models

The information here is a moving target. Check with the provider
for the proper model and zone to use for Assistant API.

Models I am using:

- openai: gpt-4-turbo-preview
- azureai: gpt-4 1106 preview in zone East US 2

---

## @sassoftware/viya-assistantjs

The document is available [here](https://sassoftware.github.io/restaf-demos/)
@sassoftware/viya-assistantjs is a JavaScript library with the following
key features

1. Write your first assistant in a few minutes

2. The tools supported OOB are:
   - code interpreter -- from the providers openai and azureai
   - retrieval - Only openai supports this the time of this writing
   - SAS Viya related custom tools
      - List available reports and libraries
      - Fetch data from Viya with filters

3. Extend or replace the tools with your own

## Getting Started

- [AI Assistant with defaults](#default)
- [Extend Assistant to support running SAS Code](#extend)

## Creating a AI Assistant with defaults<a name="default"></a>

A version of this is [here](https://github.com/sassoftware/restaf-demos/blob/viya-assistantjs/samples/example1.js)

### Step 0 - Create a nodejs project and install the following:

- @sassoftware/viya-assistantjs

Recommend that your set type to module in your package.json

### Create your program and custom tool

> In your index.js add the following imports:

```javascript
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {setupAssistant, runAssistant} from '@sassoftware/viya-assistantjs';
```

> Create the configuration object as shown below. Substitute your own values

```javascript
let config = {
  provider: 'openai'|'azureai', // Depending on who your account is with
  model: 'gpt-4-turbo-review'| for azureai the model you created in the portal
  credentials: {
    key: <your key> // obtain from provider
    endPoint: <set this to our aureai resource url if provider is azureai>
  },
  // leave the next 4 items as is - explained in the document
  assistantid: 'NEW', //leave it as is for now
  assistantName: "SAS_ASSISTANT",
  threadid: 'NEW', // Ignore this for now
  domainTools: {tools: [], functionList: {}, instructions: '', replace: false},

  // fill in the host and token to authenticate to Viya
  // set the source to cas or compute. 
  // if you want to run the AI assistant without Viya set source to none
  viyaConfig: {
    logonPayload: {
      authType: 'server',
      host: host,  // viya url - https://myviyaserver.acme.com
      token: token,// viya token  - obtained from sas-viya auth login|loginCode
      tokenType: 'bearer'//  
      },
    source: 'cas' 
  },
  code: true,
  retrieval: <Must be false for azureai>
}
```

> Add a function to handle the prompts

```javascript

chat(config)
  .then (() => console.log('bye'))
  .catch(err => console.log(err));

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

## Run the program

```cmd
node index.js
```

If everthing was setup properly, your should get a prompt(>). Enter your prompts
and get results.

### A note on prompts

Here are some prompts to try:(enter exit to stop the chat)

add 1 + 1

who is the CEO of SAS Institute?

>Warning: The actual api calls to Viya is quick, but the  
total response time from azure or openai might be much longer.

list lib

list the tables in public

fetch data from cars. Limit the rows to 10

> A fun prompt - try it
Fetch data from cars where origin='Japan'

## Extend Assistant with custom tools]<a name="extend"></a>

In this section we will extend the tools with a custom tool.
This tool maintains a list of courses.

To do this we have to fill in the domainTools in the configuration.

### Step 1: Define the customTool

**Key points**

1. Give the tool a name. This will also be the name of the function
that implements the tool.

2. The description is important - This is what helps gpt decide
 whether this tool can satisfy the request

3. The parameters are what system will extract from the prompt
and send it to your function as a params object. In this example the
value of the program will be extracted.

```javascript
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
```

### Step 2: Create the function to handle the request

```javascript
// You need to add this import to the program
// import fs from 'fs/promises';

async function myuniversity(params, appEnv) {
  let { course } = params;
  const courseList = ['math', 'science', 'english', 'history', 'art'];
  if (courseList.includes(course)) {
    return `${course} is available`;
  } else {
    return `${course} is not available`;
  }
}
```

### Step 3: Create the domainTool object in configuration

```javascript
// add the definitions to te config
config.domainTools = {
  tools: tools,
  functionList: { myuniversity: myuniversity },
  instructions: instructions,
  replace: false,
};
```

### Step 4

Run the program as you did befoee

### Prompts


> Here is a sample prompt

```text
can I take a math course?

can I take a course on Dune?
```
