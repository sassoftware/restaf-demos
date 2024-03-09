# A nodejs starter library to help SAS users build ASSISTANTS

## Works with openai Assistant api and azureai Assistant api

## Install the library into your application

```cmd
npm install @sassoftware/openai-assistantjs

Then import the following two entries in your nodejs code

import {setupAssistant, runAssistant} from "@sassoftware/openai-assistantjs";

```

## Sample program

This is a fully functional program. 

```javascript
// Import the two key methods from @sassoftware/openai-assistantjs
// import {setupAssistant, runAssistant} from "@sassoftware/openai-assistantjs";
async function run(config) {

  // setup assistant 
  let gptControl = await setupAssistant(config);

  console.log('--------------------------------------');
  console.log('Assistant: ', gptControl.assistant.name,   gptControl.assistant.id); 
  console.log('Thread: ', gptControl.thread.id);
  console.log('--------------------------------------');

  // Using inquirer.js to create an interactive session
  // Pick your method(ex: readLines)

  let questions = {
    type: "input",
    name: "prompt",
    message: ">",
  };

  let quita = ["exit", "quit", "q"];
  while (true) {
    // get user's prompt
    let answer = await inquirer.prompt(questions);
    let prompt = answer.prompt;
    if (quita.includes(prompt.toLowerCase())) {
      break;
    }
    //Note appEnv is passed to runAssistant
    // run assistant will pass both gptControl and appEnv to tools functions
    let promptInstructions = ' ';
    let response = await runAssistant(gptControl, prompt, promptInstructions,appEnv);
    console.log(response);
  }

  return "assistant session ended";
}

```

Useful links:

[Assistant documentation](https://platform.openai.com/docs/assistants/overview)

## Import

- Install the library @sassoftware/openai-assistantjs@latest
- Import the two entry points as follows:

```javascript
import { setupAssistant, runAssistant} from '@sassoftware/openai-assistantjs';
```

## setupAssistant

### Syntax for setupAssistant

```javascript

const gptControl = await setupAssistant(config)

See below for the config's schema

```

### Config object

The example below sets the values from environment variables.
You can set these directly also.

```javascript
let config = {
  provider: process.env.OPENAI_PROVIDER, 
  model: 'gpt-4-0125-preview', // change this to your perference
  credentials: { // credentials from the provider- recommend using env vaiables
    openaiKey: process.env.OPENAI_KEY,
    azureaiKey: process.env.OPENAI_AZ_KEY,
    azureaiEndpoint: process.env.OPENAI_AZ_ENDPOINT,
  },
  assistantName: process.env.OPENAI_ASSISTANTNAME, // name of the assistant
  assistantid: process.env.OPENAI_ASSISTANTID|0,// if you know the assistant id
  threadid: process.env.OPENAI_THREADID '0,// threadid if you know it. else a new one will be created
  instructions: <string with instructions for the assistant>,// instructions for the assistant
  domainTools: {
    tools: <see provider documentation>
    functionList: {nameoffunction: function, ...}
  }
}
```

## runAssistant

Use this to process user's prompts

### Syntax for runAssistant

```javascript

const msg = await runAssistant(
  gptControl, // from setupAssistant
  prompt, // User's prompt
  instructions,// additional instructions for this run or a blank string
  appEnv; // Some object you want to make available to the tool function

The msg has the following schema similar to this. 
Handling of non-text content has not been tested yet.

  [ { 
  id: <id of message>
  role: 'user'|'assistant",
  type: type of the content(ex: text),
  content: the content that was returned
 }
 ...]

```

```text
Notes on functions:

All functions of a tool heve the following enhanced arguments. 

async somefunction(params, appEnv, gptControl).

params has the schema based on the specifications of the tools (see openai documentation) 
If appEnv and gptControl are purely convenience parameters. Use them as you see fit.

```

 The response has the following schema:

 ```javascript

 [ { 
  id: <id of message>
  role: 'user'|'assistant",
  type: type of the content(ex: text),
  content: the content that was returned
 }
 ...]

 ```

## Functions

The parameters to the functions are augmented with two additional parameters.

So the parmeters for a function looks like this;

```javascript
async function myfunction(params, appEnv, gptControl)
```

- params - schema depends on the specification as explained in openai document
- appEnv - this was passed to runAssistant
- gptControl - this was returned by setupAssistant

appEnv and gptControl are convenience parameters to help the developer.
