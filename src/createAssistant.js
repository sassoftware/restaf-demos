/*
 * Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @async
 * @function createAssistant
 * @description   Create a new assistant
 * @param {string} client - client object
 * @param {object} config - configuration object
 * @returns {promise} - return assistant object
 */
async function createAssistant(client, config) {
  let { assistantName, assistantid, instructions, model, domainTools } = config;

  // create args for assistant create
  let createArgs = {
    name: assistantName,
    instructions: instructions,
    model: model,
  };
  if (domainTools.tools != null) {
    createArgs.tools = domainTools.tools;
  }

  let assistant = null;
  debugger;
  console.log(assistantid);
  let newAssistant = (assistantid === "0" || assistantid == null);
  if (newAssistant == false){ 
    assistant = await client.beta.assistants.retrieve(assistantid);
    debugger;
  } else if (assistantName != null) {
    // local rules: avoid creating a new assistant if one exists
    // use name to find the assistant
    // wish there was a way to filter on names in the API call
    debugger;
    const myAssistants = await client.beta.assistants.list({
      order: "desc",
      limit: "100", //ugh!
    });
    assistant = myAssistants.data.find((a) => {
      if (a.name === assistantName) {
        return a;
      }
    });
    // if first time using this name, create the assistant
    if (assistant == null) {
      assistant = await client.beta.assistants.create(createArgs);
    }
  }
  
  debugger;
  return assistant;
}
export default createAssistant;
