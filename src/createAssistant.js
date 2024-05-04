/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import deleteAssistant from "./deleteAssistant.js";
import assistantByName from "./assistantByName.js";

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

  console.log("devMode is ", devMode);

  // devMode = true - creater a fresh assistant
  if (devMode === true) {
    appControl.threadid = null;
    await deleteAssistant(appControl, null);
    let assistant = await newAssistant(appControl);
    return assistant;
  }

  //-------------------------------------------------------------
  // if assistantid or assistantname is provided, use it
  // fail if not found
  // assistantid takes precedence over assistantName
  let assistant = null;
  console.log(assistantid);
  try {
    if (assistantid != null) {
      console.log("Attempting to find assistant by id", assistantid);
      assistant = await assistantApi.getAssistant(assistantid);
    } else {
      assistant = await assistantByName(assistantName, appControl);
    }
    if (assistant == null) {
      throw new Error("Assistant not found", assistantName);
    }
  } catch (error) {
   
    if (assistantid == null && assistantName != null) {
      console.log("Creating new assistant", assistantName);
      assistant = await newAssistant(appControl);
    } else {
      console.log("Error finding assistant", error);
       throw new Error("Error finding assistant", error);
    }
  }

  // Now we have an existing assistant available
  // setup thread and vector store

  appControl.assistant = assistant;
  appControl.assistantid = assistant.id;
  console.log(assistant.name, assistant.id, assistant.metadata);
  let thread = null;

  // if threadid is not provided, use the last thread
  let threadid =
    appControl.threadid != null
      ? appControl.threadid
      : assistant.metadata.lastThread;

  // if vectorStoreid is not provided, use the last vectorStoreid
  let vectorStoreid =
    appControl.vectorStoreid != null
      ? appControl.vectorStoreid
      : assistant.metadata.vectorStoreid;

  // make sure the vector store id is valid
  try {
    let vs = await assistantApi.getVectorStore(vectorStoreid);
    console.log("Vector store found", vs.id, vs.name);
    appControl.vectorStore = vs;
  } catch {
    console.log("No vector store found", appControl.vectorStoreid);
    throw new Error("No vector store found", appControl.vectorStoreid);
  }

  // check and see the threadid is valid
  try {
    thread = await assistantApi.getThread(threadid);
    console.log('Thread found', thread.id, thread.metadata);
  } catch {
    console.log("No thread found", threadid);
    throw new Error("No thread found", threadid);
  }

  // now update thread with the current tool_resources
  // ignoring if state is the same
  let tool_resources = {
    file_search: {
      vector_store_ids: [vectorStoreid],
    },
  };
  if (appControl.provider === "openai") {
    thread = await assistantApi.updateThread(thread.id, {
      tool_resources: tool_resources});
    console.log('Thread updated', thread.id);
  } else {
    console.log("No updates to threads in azureai");
  }
  assistant.thread = thread;
  assistant.threadid = thread.id;

  // update assistant with the new info - ignoring if state is the same

  let metadata = assistant.metadata;
  metadata.lastThread = thread.id;
  metadata.vectorStoreid = vectorStoreid;
  let options = {
    metadata: metadata,
    tool_resources: tool_resources,
  };

  assistant = await assistantApi.updateAssistant(assistant.id, options);
  appControl.assistant = assistant;
  appControl.assistantid = assistant.id;
  appControl.thread = thread;
  appControl.threadid = thread.id;
  appControl.vectorStoreid = vectorStoreid;
  appControl.vectorStore = appControl.vectorStore;
  return appControl.assistant;
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

  // vector for openai only
  if (appControl.provider === "openai") {
    let t = await assistantApi.createVectorStores({ name: assistantName });
    appControl.vectorStoreid = t.id;
    createArgs.tool_resources = {
      file_search: {
        vector_store_ids: [t.id],
      },
    };
  }

  // create the assistant

  let assistant = await assistantApi.createAssistant(createArgs);
  console.log("Created assistant ", assistant.name, assistant.id);

  appControl.assistant = assistant;
  appControl.assistantid = assistant.id;


  let tool_resources = {
    file_search: {
      vector_store_ids: [appControl.vectorStoreid],
    },
  };
  let options = {};
  if (appControl.provider === "openai") {
    options = {
      tool_resources: tool_resources
    };
  }
  let thread = await assistantApi.createThread(options);

  appControl.thread = thread;

  // last step: update meatata
  let metadata = assistant.metadata;
  metadata.lastThread = thread.id;
  metadata.vectorStoreid = !appControl.vectorStoreid
    ? ""
    : appControl.vectorStoreid;
  options = {
    metadata: metadata,
  };
  console.log("Updating assistant metadata", options);
  let newAssistant = await assistantApi.updateAssistant(assistant.id, options);

  // reset assistant in appControl
  appControl.assistant = newAssistant;
  appControl.assistantid = newAssistant.id;
  return assistant;
}
export default createAssistant;
