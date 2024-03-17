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
    if (!(assistantid === "0" || assistantid === "-1")) {
      console.log("Using assistantid ", assistantid);
      let assistant = await assistantApi.getAssistant(assistantid);
      gptControl.assistant = assistant;
      gptControl.assistantid = assistant.id;
      return assistant;
    }

    // create args for assistant create
    let createArgs = {
      name: assistantName,
      instructions: instructions,
      model: model,
      tools: domainTools.tools,
    };

    //New local rules
    // if assistantid is -1, try to find the assistant by name.
    //    then create a new assistant with the same name
    // if assistantid is 0, create a new assistant with the name

    if (assistantid === "-1") {
      console.log("Attempting to find assistant by name ", assistantName);
      const myAssistants = await assistantApi.listAssistants({
        order: "desc",
        limit: "100",
      });
      let assistant = myAssistants.data.find((a) => {
        if (a.name === assistantName) {
          return a;
        }
      });
      if (assistant != null) {
        console.log("Found assistant ", assistantName, assistant.id)
        return assistant;
      }
    }

    // fall thru to create a new assistant
    console.log("Creating new assistant");
    let assistant = await assistantApi.createAssistant(createArgs);
    gptControl.assistantid = assistant.id;
    gptControl.assistant = assistant;

    return assistant;
  } catch (error) {
    console.log(error);
    throw new Error(
      `Error status ${error.status}. Failed to create assistant. See console for details.`
    );
  }
}
export default createAssistant;
