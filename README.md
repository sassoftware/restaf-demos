# Building and Running Openai Assistant in JavaScript Made Simple

This library simplifies the development and execution of an Assistant.

It handles all the interactions with openai. It has the following methods:

- setupAssistant   -- as the name suggests it setup the assistant session
- runAssistant -- takes a prompt and runs the assistan and returns the reponse

Useful links:

[Assistant documentation](https://platform.openai.com/docs/assistants/overview)

## Import

- Install the library @sassoftwae/openai-assistantjs@latest

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

```javascript
{
    provider:  'openai', /* azureai is coming soon */
    assistantName:  'a name for the assistant', /* ex: SAS_ASSISTANT. Reuse name to keep costs down */
    instructions:  'some assistant instructions', /* instructions for the assistant. Ignored if assistant exists */
    model: 'gpt-4', /* the gpt model you want to use */
    reuseThread: true|false, /* if false it will create a new thread. else will use the specified threadid */
    threadid:  '0' | a valid threadid, /* Unfortunately there is no api to manage threads. So reusing might be a good option (with its drawbacks)*/
    credentials: {/* credentials for openai or azureai */
      openaiKey: openai key,
      azureaiKey: azureai key, 
      azureaiEndpoint: azureai endpoint
    }
    server: 'none'|'cas'|'compute'
}

```

## runAssistant

Use this to process user's prompts

### Syntax for runAssistant

```javascript

const msg = await runAssistant(prompt, gptControl, appEnv, instructions)

```

The parameters are:

- prompt - the user's prompt(ex: add 1 + 1)
- gptControl - the control object from the setupAssistant call
- appEnv - null | some object defined by user(see functions below),\
- instructions - null | additional instructions for this run

This function will wait for prompt to be handled (success or failure) and
return the final response.
Note that this response will be in the thread's messages.

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
