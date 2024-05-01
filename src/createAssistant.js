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
 * @param {appControl} appControl - appControl object
 * @returns {promise} - return assistant object
 */

async function createAssistant(appControl) {
  let { assistantName, assistantid, devMode, assistantApi } = appControl;

  // get assistant by assistantid
  // use this when developing the assistant
  // reduces clutter on your gpt provider
  console.log("devMode is ", devMode);
  if (devMode === true) {
    appControl.threadid = null;
    await deleteAssistant(appControl, null);
    let assistant = await newAssistant(appControl);

    return assistant;
  }

  // if assistantid is provided, use it
  if (assistantid != null) {
    console.log("Using assistantid ", assistantid);
    let assistant = await assistantApi.getAssistant(assistantid);
    appControl.assistant = assistant;
    appControl.assistantid = assistant.id;
    if (appControl.vectorStoreid === null) {
      let vs = await assistantApi.getVectorStore(assistant.metadata.vectorStoreid);
      appControl.vectorStoreid = assistant.metadata.vectorStoreid;
    } 
    await loadThread(appControl);
    return appControl.assistant;
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
      appControl.assistant = assistant;
      appControl.assistantid = assistant.id;
      console.log("Found assistant ", assistantName, assistant.id);
      await loadThread(appControl);
      console.log(assistant.metadata);
      if (appControl.vectorStoreid === null) {
        let vs = await assistantApi.getVectorStore(assistant.metadata.vectorStoreid);
         appControl.vectorStoreid = assistant.metadata.vectorStoreid;
      }
    } else {
      // create a new assistant as a last resort
      assistant = await newAssistant(appControl);
      appControl.assistant = assistant;
      appControl.assistantid = assistant.id;
      console.log(assistant.metadata);
      if (appControl.vectorStoreid === null) {
         appControl.vectorStoreid = assistant.metadata.vectorStoreid;
      }
      await loadThread(appControl);
      console.log(
        "Created new assistant ",
        appControl.assistant.id,
        appControl.assistant.name
      );
    }
    return appControl.assistant;
  }
}

async function newAssistant(appControl) {
  let { assistantName, domainTools, model, assistantApi } = appControl;
  let createArgs = {
    name: assistantName,
    instructions: domainTools.instructions,
    model: model,
    temperature: appControl.temperature,
    tools: domainTools.tools,
    metadata: { files: " ", lastThread: "", vectorStoreid: "" },
  };
  if (appControl.provider === "openai") {
    let t = await assistantApi.createVectorStores({ name: assistantName });
    appControl.vectorStoreid = t.id;
    createArgs.tool_resources = {
      file_search: {
        vector_store_ids: [t.id],
      },
    };
  }

 
  let assistant = await assistantApi.createAssistant(createArgs);
  console.log("Created assistant ", assistant.name, assistant.id);

  // now create a new thread
  appControl.assistant = assistant;
  appControl.assistantid = assistant.id;
  let thread = await loadThread(appControl);
  appControl.thread = thread;
  let metadata = assistant.metadata;
  metadata.lastThread = thread.id;
  metadata.vectorStoreid = (!appControl.vectorStoreid) ? "" : appControl.vectorStoreid
  let options = {
    metadata: metadata,
  };
  console.log('Updating assistant metadata', options);
  let newAssistant = await assistantApi.updateAssistant(assistant.id, options);
  appControl.assistant = newAssistant;
  appControl.assistantid = newAssistant.id;
  return assistant;
}
export default createAssistant;
