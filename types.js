/**
 * Code logon payload
 * @typedef {object} logonPayloadCode
 * @property {"code"|"server"} authType
 * @property {URL} host
 * @property {string} token optional
 * @property {"Bearer"} bearer optional
 */

/**
 * credentials object
 * @typedef {object} credentials
 * @property {string} key - key for openai|azureai
 * @property {string} endPoint - endpoint for azureai
 */

/**
 * tool specification
 * @typedef {object} toolspecs
 * @property {array} tools - array of tool definitions
 * @property {object} functionList - object of tool functions{a: function, b: function, ...}
 * @property {string} instructions - instructions string
 * @property {boolean} replace - replace flag(false) - append user tools to builtins
 */

/**
 * setup configurations
 * @typedef {object} config
 * @property {string} provider - provider name
 * @property {string} model - model name
 * @property {credentials} credentials - credentials object
 * @property {string} assistantid - assistant id
 * @property {string} assistantName - assistant name
 * @property {string} threadid - thread i
 * @property {toolspecs} domainTools - domain tools
 * @property {object} viyaConfig - viya config
 * @property {string} logLevel - log level
 * @property {boolean} code - if true enable code-interpreter
 * @property {boolean} retrieval - if true enable retrieval
 * @property {object} userData - user data
 */


 
/**
 * api object
 * @typedef {object} assistantApi
 * @property {function} getAssistant - get assistant 
 * @property {function} listAssistants - list assistants 
 * @property {function} createAssistant - create assistant 
 * @property {function} listMessages - list messages 
 * @property {function} createMessage - create message 
 * @property {function} createThread - create thread 
 * @property {function} getThread - get thread 
 * @property {function} createRun - create run
 * @property {function} getRun - get run 
 * @property {function} cancelRun - cancel run 
 * @property {function} listRuns - list runs 
 * @property {function} submitToolOutputsToRun - submit tool outputs to run 
 * 
 */

/**
 * gptControl object
 * @typedef {object} gptControl
 * @property {string} provider - provider name
 * @property {string} model - model name
 * @property {toolspecs} domainTools tools prepended to the builtins
 * @property {string} instructions- Instructions string|null. If null default instructions is used
 * 
 * @property {string} assistantName - assistant name
 * @property {object} assistant - current assistant object|null
 * @property {string} assistantid - assistant id|'0'|null
 
 * @property {object} thread - thread object|null
 * @property {string} threadid - thread id|'0'|null
 
 * @property {object} appEnv - Viya session control object|null
 * @property {object} client - client object for openai|azureai
 * @property {object} run  - active run object|null
 * @property {assistantApi} api - commong api object for openai and azureai. Follows azuereai api
 * @property {boolean} retrievalFlag - retrieval flag
 */
  

