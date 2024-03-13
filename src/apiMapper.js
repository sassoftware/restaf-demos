
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

/*
* spreading and extracting args since one of the goals is help learn the api
* makes it easier to come back a few months later and understand what is going on
*/
function apiMapper(client, provider) {

  const listAssistants = (client) => (...args) =>{
    let [options] = args;
    return client.beta.assistants.list(options)
  }
  const getAssistant = (client) => (...args) =>{
    let [id] = args;
    return client.beta.assistants.retrieve(id)
  }
  const deleteAssistant = (client) => (...args) =>{
    let [id] = args;
    return client.beta.assistants.del(id)
  }
  const createAssistant = (client) => (...args) =>{
    let [options] = args;
    return client.beta.assistants.create(options)
  }

  const updateAssistant = (client) => (...args) =>{
    let [id, options] = args;
    return client.beta.assistants.update(id, options);
  }


  const listMessages = (client) => (...args) =>{
    let [threadid, options] = args;
    return client.beta.threads.messages.list(threadid, options)
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
    let [metadata] = args;
    if (metadata == null) {
      metadata = {};
    }
    return client.beta.threads.create(metadata)
  }
  const getThread = (client) => (...args) =>{
    let [id] = args;
    return client.beta.threads.retrieve(id)
  }

  const deleteThread = (client) => (...args) =>{
    let [id] = args;
    return client.beta.threads.del(id)
  }

  const createRun = (client) => (...args) =>{
    let [threadid, options] = args;
   // options.thread = threadid;
    let newOptions = {
      assistant_id: options.assistantId,
      instructions: options.instructions,
    }
    return client.beta.threads.runs.create(threadid, newOptions);
  }
  const getRun = (client) => (...args) =>{
   let [threadid, runid] = args;
    return client.beta.threads.runs.retrieve(threadid, runid)
  }

  const submitToolOutputsToRun = (client) => (...args) =>{
    let [ threadid, runid, options] = args;
    return client.beta.threads.runs.submitToolOutputs(threadid, runid, options  );
  }
  const listRuns= (client) => (...args) =>{
    let [id] = args;
    return client.beta.threads.runs.list(id);
  }
  const cancelRun = (client) => (...args) =>{
    let [threadid, runid] = args;
    return client.beta.threads.runs.cancel(threadid, runid);
  }
  let assistantApi = client;
  if (provider === 'openai') {
    assistantApi = {
      listAssistants: listAssistants(client),
      createAssistant: createAssistant(client),
      getAssistant: getAssistant(client),
      deleteAssistant: deleteAssistant(client),
      updateAssistant: updateAssistant(client),
    
      createThread: createThread(client),
      getThread: getThread(client),
      deleteThread: deleteThread(client),

      createMessage: createMessage(client),
      listMessages: listMessages(client),
     
      createRun: createRun(client),
      getRun: getRun(client),
      listRuns: listRuns(client),
      cancelRun: cancelRun(client),
      submitToolOutputsToRun: submitToolOutputsToRun(client)
      };

  }
  return assistantApi;
}
export default apiMapper;
