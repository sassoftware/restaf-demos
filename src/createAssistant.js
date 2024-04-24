/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import loadThread from "./loadThread.js";
import deleteAssistant from "./deleteAssistant.js";

/**
 * @async
 * @private
 * @function createAssistant
 * @description   Create a new assistant
 * @param {gptControl} gptControl - gptControl object
 * @returns {promise} - return assistant object
 */

async function createAssistant(gptControl) {
  let { assistantName, assistantid, devMode, assistantApi } = gptControl;

  // get assistant by assistantid
  // use this when developing the assistant
  // reduces clutter on your gpt provider
  console.log("devMode is ", devMode);
  if (devMode === true) {
    gptControl.threadid = null;
    await deleteAssistant(gptControl, null);
    let assistant = await newAssistant(gptControl);

    return assistant;
  }

  // if assistantid is provided, use it
  if (assistantid != null) {
    console.log("Using assistantid ", assistantid);
    let assistant = await assistantApi.getAssistant(assistantid);
    gptControl.assistant = assistant;
    gptControl.assistantid = assistant.id;
    if (gptControl.vectorStoreid === null) {
      let vs = await assistantApi.getVectorStore(assistant.metadata.vectorStoreid);
      gptControl.vectorStoreid = assistant.metadata.vectorStoreid;
    } 
    await loadThread(gptControl);
    return gptControl.assistant;
  }

  // if assistantName is provided and assistantid is null
  // find assistant by name and use it
  // if not found, create a new assistant with that name

  let assistant = null;
  if (assistantName != null) {
    console.log("Attempting to find assistant by name ", assistantName);
    const myAssistants = await assistantApi.listAssistants({
      order: "desc",
      limit: "100",
    });
    assistant = myAssistants.data.find((a) => {
      if (a.name === assistantName) {
        return a;
      }
    });
    
    if (assistant != null) {
      gptControl.assistant = assistant;
      gptControl.assistantid = assistant.id;
      console.log("Found assistant ", assistantName, assistant.id);
      await loadThread(gptControl);
      console.log(assistant.metadata);
      if (gptControl.vectorStoreid === null) {
        let vs = await assistantApi.getVectorStore(assistant.metadata.vectorStoreid);
         gptControl.vectorStoreid = assistant.metadata.vectorStoreid;
      }
    } else {
      // create a new assistant as a last resort
      assistant = await newAssistant(gptControl);
      gptControl.assistant = assistant;
      gptControl.assistantid = assistant.id;
      console.log(assistant.metadata);
      if (gptControl.vectorStoreid === null) {
         gptControl.vectorStoreid = assistant.metadata.vectorStoreid;
      }
      await loadThread(gptControl);
      console.log(
        "Created new assistant ",
        gptControl.assistant.id,
        gptControl.assistant.name
      );
    }
    return gptControl.assistant;
  }
}

async function newAssistant(gptControl) {
  let { assistantName, domainTools, model, assistantApi } = gptControl;
  let createArgs = {
    name: assistantName,
    instructions: domainTools.instructions,
    model: model,
    temperature: gptControl.temperature,
    tools: domainTools.tools,
    metadata: { files: " ", lastThread: "", vectorStoreid: "" },
  };
  if (gptControl.provider === "openai") {
    let t = await assistantApi.createVectorStores({ name: assistantName });
    gptControl.vectorStoreid = t.id;
    createArgs.tool_resources = {
      file_search: {
        vector_store_ids: [t.id],
      },
    };
  }

 
  let assistant = await assistantApi.createAssistant(createArgs);
  console.log("Created assistant ", assistant.id, assistant.name);

  // now create a new thread
  gptControl.assistant = assistant;
  gptControl.assistantid = assistant.id;
  let thread = await loadThread(gptControl);
  gptControl.thread = thread;
  let metadata = assistant.metadata;
  metadata.lastThread = thread.id;
  metadata.vectorStoreid = (!gptControl.vectorStoreid) ? "" : gptControl.vectorStoreid
  let options = {
    metadata: metadata,
  };
  console.log(options);
  let newAssistant = await assistantApi.updateAssistant(assistant.id, options);
  gptControl.assistant = newAssistant;
  gptControl.assistantid = newAssistant.id;
  return assistant;
}
export default createAssistant;
