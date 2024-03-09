
/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @private
 * @description - Map openai to azureai assistantApi
 * @function apiMapper
 * @param {object} client - openai client
 * @param {string} provider - openai or azureai
 * returns {assistantApi} - assistantApi - return the apiAssistant object with entries for openai or azureai
 * @example - Allows this library to work for both openai and azureai Assistant
 */
function apiMapper(client, provider) {

  const listAssistants = (client) => (...args) =>{
    return client.beta.assistants.list(args)
  }
  const getAssistant = (client) => (...args) =>{
    return client.beta.assistants.retrieve(args)
  }

  const createAssistant = (client) => (...args) =>{
    return client.beta.assistants.create(args)
  }

  const listMessages = (client) => (...args) =>{
    return client.beta.threads.messages.list(args)
  }

  const createMessage = (client) => (...args) =>{
    let [threadid, role, content] = args;
    let options = {
      role: role,
      content: content
    }
    return client.beta.threads.messages.create(threadid, options);
  }

  const createThread = (client) => (...args) =>{
    return client.beta.threads.create(args)
  }
  const getThread = (client) => (...args) =>{
    return client.beta.threads.retrieve(args)
  }

  const createRun = (client) => (...args) =>{
    let [threadid, options] = args;
    options.thread = threadid;
    let newOptions = {
      assistant_id: options.assistantId,
      instructions: options.instructions,
    }
    return client.beta.threads.runs.create(threadid, newOptions);
  }
  const getRun = (client) => (...args) =>{
    console.log('getRun', args);
    let [threadid, runid] = args;
    return client.beta.threads.runs.retrieve(threadid, runid)
  }

  const submitToolOutputsToRun = (client) => (...args) =>{
    console.log('submitToolOutputsToRun', JSON.stringify(args, null,4));
    return client.beta.threads.runs.submitToolOutputs(args)
  }
  const listRuns= (client) => (...args) =>{
    return client.beta.threads.runs.list(args)
  }
  const cancelRun = (client) => (...args) =>{
    return client.beta.threads.runs.cancel(args)
  }
  let assistantApi = client;
  if (provider === 'openai') {
    assistantApi = {
      listAssistants: listAssistants(client),
      createAssistant: createAssistant(client),
      getAssistant: getAssistant(client),
    
      createThread: createThread(client),
      getThread: getThread(client),

      createMessage: createMessage(client),
      listMessages: listMessages(client),
     
      createRun: createRun(client),
      getRun: getRun(client),
      listRuns: listRuns(client),
      cancelRun: cancelRun(client),
      submitToolOutputsToRun: submitToolOutputsToRun(client)
      };
    console.log(assistantApi);

  }
  return assistantApi;
}
export default apiMapper;
