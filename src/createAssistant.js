/*
 * Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @async
 * @private
 * @function createAssistant
 * @description   Create a new assistant
 * @param {gptControl} gptControl - gptControl object
 * @returns {promise} - return assistant object
 */


async function createAssistant(gptControl) {
  let { assistantName, model, assistantid, instructions, domainTools,  assistantApi } = gptControl;
 
  // create args for assistant create
  let createArgs = {
    name: assistantName,
    instructions: instructions,
    model: model, 
    tools: domainTools.tools,
  };
  
  let assistant = null;
  let newAssistant = (assistantid === "0" || assistantid == null);
  if (newAssistant == false){ 
    assistant = await assistantApi.getAssistant(assistantid);
    
  } else if (assistantName != null) {
    // local rules: avoid creating a new assistant if one exists
    // use name to find the assistant
    // wish there was a way to filter on names in the API call
    
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
      
      console.log('Creating new assistant');
      assistant = await assistantApi.createAssistant(createArgs);
    }
  }
  
  
  gptControl.assistantid = assistant.id;
  gptControl.assistant = assistant;

  return assistant;
}
export default createAssistant;
