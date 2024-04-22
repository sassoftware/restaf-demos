
/**
 * assistantjs setup configuration
 * @typedef {object} config
 * @property {string} provider - provider name
 * @property {string} model - GPT model name
 * @property {credentials} credentials - credentials object
 * @property {string} devMode - true|false(default false)
 * @property {string} assistantid - assistant id(used if non-null)
 * @property {string} assistantName - assistant name(used if assistantid is null)
 * @property {string} threadid - thread id|null (used if non-null and devMode is false)

 * @property {toolspecs} domainTools - domain tools
 * @property {object} viyaConfig - viya config
 * @property {string} logLevel - log level
 * @property {boolean} code - if true enable code-interpreter
 * @property {boolean} retrieval - if true enable retrieval
 * @property {object} userData - user data object
 */

/**
 * credentials object
 * @typedef {object} credentials
 * @property {string} key - key for openai|azureai
 * @property {string} endPoint - endpoint for azureai
 */

/**
 * logonPayload object for SAS Viya
 * @typedef {object} logonPayload
 * @property {string} authType - code|token
 * @property {URL} host - host url
 * @property {string} token - token (if authType is token)
 * @property {string} tokenType - bearer(if authType is token)
 * @property {string} bearer - bearer(if authType is token)
 * 
 */

/**
 * tool specification
 * @typedef {object} toolspecs
 * @property {array} tools - array of tool definitions
 * @property {object} functionList - object of tool functions{a: functionA, b: functionb, ...}
 * @property {string} instructions - instructions string
 */



/**
 * viyaConfig object
 * @typedef {object} viyaConfig
 * @property {logonPayload} logonPayload - logon payload
 * @property {object} additional options for restaf
 */



/**
 * api object
 * @typedef {object} assistantApi
 * @property {function} listAssistants - list assistants 
 * @property {function} getAssistant - get assistant  
 * @property {function} createAssistant - create assistant 
 * @property {function} deleteAssistant - delete assistant
 * @property {function} updateAssistant - update assistant
 * @property {function} listMessages - list messages 
 * @property {function} createMessage - create message 
 * @property {function} createThread - create thread 
 * @property {function} getThread - get thread
 * @property {function} deleteThread - delete thread 
 * @property {function} createRun - create run
 * @property {function} getRun - get run 
 * @property {function} cancelRun - cancel run 
 * @property {function} listRuns - list runs 
 * @property {function} submitToolOutputsToRun - submit tool outputs to run 
 * @property {function} uploadFile - upload file
 * @property {function} createAssistantFile - create assistant file
 * @property {function} deleteFile - delete file
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
 * @property {assistantApi} api - maps openai api to azureai api(most of them)
 * @property {object} code - if true, enable code interpreter
 * @property {boolean} retrievalFlag - if true enable retrieval
 * @property {object} userData - user data object
 * @property {function} viyaOnDemand - viyaOnDemand function 
 */
  

/**
 * appEnv object
 * @property {string} host - url to viya server
 * @property {logonPayload} - logonPayload
 * @property {string} source - cas|compute|none
 * @property {object} userData - user data object
 * @property {object} session - session object(for restaf users) if source is cas or compute
 * @property {object} servers - servers object(for restaf users) if source is cas or compute
 * @property {string} sessionID - session id if source is cas or compute
 * @property {object} store - restaf store object
 * @property {object} restaflib - restaflib object if source is cas or compute
 * @property {object} restafedit - restafedit object if source is cas or compute
 * @property {object} serverName - compute context or cas server name
*/
