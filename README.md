# @sassoftware/viya-assistantjs - Build your own AI ASSISTANT for SAS Viya

## Introduction to azure and openai Assistant API

The Assistant API is a new API that was announced late in 2003 by openai.
A clear explanation of what it is at
<a href="https://platform.openai.com/docs/assistants/how-it-works">How Assistants works</a>

With this api one can build a "RAG" with SAS Viya capabilities.

The Assistant API is supported by both openai and azureai. However their apis are different.
Also azureai does not support the retrieval tool yet.

The Assistant API is in beta/preview. So it is not ready for prime
 time but good enough to develop non-production Assistants.

### gpt models

The information here is a moving target. Check with the provider
for the proper model and zone to use for Assistant API.

Models I am using:

- openai: gpt-4-turbo-preview
- azureai: gpt-4 1106 preview in zone East US 2

---
> The goal of @sassoftware/viya-assistantjs library is to simplify the development
of AI Assistants for Viya using either the openai or azureai implementation.

- <a href="https://https://sassoftware.github.io/restaf-demos">Documentation </a>
- <a href="https://github.com/sassoftware/restaf-demos/tree/viya-assistantjs">Repository</a>

The library comes with a set of builtin tools to get a list of libraries, tables
and run SAS code. .

---

## Basic steps

1. As a developer, you can add to  the builtin Viya tools or replace them.
    - create tool specifications and functions to implement these tools
    - The  builtin tool to run SAS code is very basic since it is unclear
where the code will come from(and whether it even makes sense in this scenario).
Recommend developer override the implementation
 via the configuration object for setupAssistant by creating a _runSAS tool.

2. Call the *setupAssistant* method with this information
along with other configuration information.
3. Submit user prompt using the *runAssistant* method which will return the final
 answer. This answer might have been created by gpt or by one of your tools/functions.
4. Process this response and repeat step 3.
5. Additionally you can use the uploadFile method
to upload information to the Assistant for use with the retrieval or
code_interpreter tool

The library handles all the calls to the Assistant API.

## Getting Started

- [AI Assistant with defaults](#default)
- [Extend Assistant to support running SAS Code](#extend)

If you are developing a react app the call sequence is the same.

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

## Extend Assistant with custom tools<a name="extend"></a>

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
