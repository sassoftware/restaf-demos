/*
 * Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @async
 * @private
 * @function createAssistant
 * @description   Create a new assistant
 * @param {string} client - client object
 * @param {object} gptControl - gptControl object
 * @returns {promise} - return assistant object
 */


async function createAssistant(gptControl) {
  let { assistantName, model, assistantid, instructions, domainSpecs, assistantApi } = gptControl;
 
  // create args for assistant create
  let createArgs = {
    name: assistantName,
    instructions: instructions,
    model: model, 
    tools: domainSpecs.tools,
  };

  let assistant = null;
  debugger;
  console.log(assistantid);
  let newAssistant = (assistantid === "0" || assistantid == null);
  if (newAssistant == false){ 
    assistant = await assistantApi.getAssistant(assistantid);
    debugger;
  } else if (assistantName != null) {
    // local rules: avoid creating a new assistant if one exists
    // use name to find the assistant
    // wish there was a way to filter on names in the API call
    debugger;
    const myAssistants = await assistantApi.listAssistants({
      order: "desc",
      limit: "100", 
    });
    assistant = myAssistants.data.find((a) => {
      if (a.name === assistantName) {
        return a;
      }
    });
    // if first time using this name, create the assistant
    if (assistant == null) {
      assistant = await assistantApi.createAssistant(createArgs);
    }
  }
  
  debugger;
  gptControl.assistantid = assistant.id;
  gptControl.assistant = assistant;

  return assistant;
}
export default createAssistant;
