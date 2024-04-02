/*
 * Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import loadThread from "./loadThread.js";

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
      gptControl.assistant = assistant;
      gptControl.assistantid = assistant.id;
      // gptControl.thread = assistant.metadata.lastThread;
      gptControl.threadid  = assistant.metadata.lastThread;
      return assistant;
    }

    // create args for assistant create
    let createArgs = {
      name: assistantName,
      instructions: instructions,
      model: model,
      tools: domainTools.tools,
      metadata: {files:' ', lastThread: ''},
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
    debugger;
    console.log("Found assistant ", assistant);

    // if we found an assistant with the same name, use it
    // This means the thread will be resued as well
    if (assistant != null  && assistantid === 'REUSE') {
      console.log("Found assistant ", assistantName, assistant.id);
      gptControl.assistant = assistant;
      gptControl.assistantid = assistant.id;
      gptControl.thread    = assistant.metadata.lastThread;
      gptControl.threadid  = assistant.metadata.lastThread;
      return assistant;
    }
    
    // assistantid=0 means create a new assistant and new thread
    if (assistant != null) {
      //first delete the thread
      console.log(assistant.metadata);
      if (assistant.metadata.lastThread != null && assistant.metadata.lastThread.trim().length > 0) {
        console.log('deleting thread ', assistant.metadata.lastThread);
        await assistantApi.deleteThread(assistant.metadata.lastThread);
      }
      // now delete the files associated with the assistant
      // the metadata has the list of files that were loaded explicitly for this assistant
      let files = (assistant.metadata.files != null) ?assistant.metadata.files.split(' ') :[];
      for (let i = 0; i < files.length; i++) {
        if (files[i].trim().length === 0) continue;
        console.log("Deleting Assistant file ", files[i])
        let r = await assistantApi.deleteFile(files[i]);
      }
      console.log("Deleting old assistant ", assistantName, assistant.id);
      await assistantApi.deleteAssistant(assistant.id);
    }
    // fall thru to create a new assistant
    console.log("Creating new assistant");
    assistant = await assistantApi.createAssistant(createArgs);
    console.log("Created assistant ", assistant.id, assistant.name);
    // now create a new thread
    gptControl.assistant = assistant;
    gptControl.assistantid = assistant.id;
    gptControl.threadid = 'NEW';
    let thread = await loadThread(gptControl);
    console.log(thread);
    gptControl.thread = thread;
    let metadata = assistant.metadata;
    metadata.lastThread = thread.id;
    let options = {
      metadata: metadata,
    };
    let newAssistant = await assistantApi.updateAssistant(assistant.id, options);
    gptControl.assistant = newAssistant;
    return assistant;
  } catch (error) {
    console.log(error);
    throw new Error(
      `Error status ${error.status}. Failed to create assistant. See console for details.`
    );
  }
}
export default createAssistant;
