# setupAssistant Configuration

## Schema

```javascript
let config = {
    provider: 'azureai',// or 'openai'
    model: gpt model, //For azure it is the model created on Azure Portal
    credentials: {
      key: <key for openai or azureai> //from openai or azureai
      endPoint: <url of AzureAI resource> // From azureai portal
    },
    assistantid: '-1'| '0'| valid assistantid 
    assistantName: <name of the assistant>,
    threadid: '-1'|'0'|valid threadid, 
    code: true, 
    retrieval: true,
    userData: <some object set by developer>
}

```

## provider

This is either 'openai' or 'azureai" depending on who your provider is.

## model and credentials

- openai: A model that supports assistant api
<a href="https://platform.openai.com/api-keys">Openai keys </a>

- azureai: This is the deployment you create with Azure AI studio. 
Visit <a href="https://oai.azure.com/portal">Azure AI portal </a>

## Assistantid and AssistantName


Each instance of assistant has a unique id, However the names of the assistants
are not unique.

To avoid adding the overhead of persisting these ids during develop
the library has local rules.

1. If assistandid is specified, it then used to retrieve the session.
(suspect this would be a production scenario)
2. If assistandid is '-1' then search for an assistant with the assistName.
   - If not found drop down to option 3 below and create a new assistant
3. If assistantid is '0' then create a new assistant with the sessionName
   - This might result in multiple assistants with the same name. Visit the
   playground to manage these assistants

During development recommend setting assistantid to -1.

## Threadid

Thread is used to manage the conversation thread. 
Unlike the assistant, there is no exposed api to get a list of threads.
Unless the calling application keeps track of the threads, one could have a lot
of "orphaned" threads.

To avoid this situation the library enforces a "local rule".

1. If threadid is specified, it then re-used.
(suspect this would be a production scenario)
2. If threadid is '-1', then the threadid saved
with the assistant is used(see 3 below).
If this thread is not found, then this is same as option 3.
3. If threadid is '0' then a new thread is created
   - This thread's id saved in the current assistant's metadata. So
   when the threadid is '-1' on a subsequent call,
   the same thread is used

## userData

You can set this to some object. This is passed along to the
handlers for the custom tools. Some potential uses are
to pass your application specific information to the custom tools.
