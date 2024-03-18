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
  let {
    assistantName,
    model,
    assistantid,
    instructions,
    domainTools,
    assistantApi,
  } = gptControl;

  // get assistant by assistantid
  debugger;
  try {
    if (!(assistantid === "NEW" || assistantid === "REUSE")) {
      console.log("Using assistantid ", assistantid);
      let assistant = await assistantApi.getAssistant(assistantid);
      return assistant;
    }

    // create args for assistant create
    let createArgs = {
      name: assistantName,
      instructions: instructions,
      model: model,
      tools: domainTools.tools,
    };

    
    // see if there is an assistant with the same name
    console.log("Attempting to find assistant by name ", assistantName);
    let assistant = null;
    const myAssistants = await assistantApi.listAssistants({
      order: "desc",
      limit: "100",
    });
    assistant = myAssistants.data.find((a) => {
      if (a.name === assistantName) {
        return a;
      }
    });

    // if we found an assistant with the same name, use it
    // since assistantid is -1
    if (assistant != null  && assistantid === 'REUSE') {
      console.log("Found assistant ", assistantName, assistant.id)
      return assistant;
    }
    
    // assistantid=0 means create a new assistant
    if (assistant != null) {
      console.log("Deleting old assistant ", assistantName, assistant.id);
      await assistantApi.deleteAssistant(assistant.id);
    }
    // fall thru to create a new assistant
    console.log("Creating new assistant");
    assistant = await assistantApi.createAssistant(createArgs);
    return assistant;
  } catch (error) {
    console.log(error);
    throw new Error(
      `Error status ${error.status}. Failed to create assistant. See console for details.`
    );
  }
}
export default createAssistant;
