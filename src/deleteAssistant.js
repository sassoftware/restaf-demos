/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @async
 * @description - Delete assistant
 * @function closeAssistant
 * @param {appControl} appControl - gpt session control object
 * @param {object} [assistantid] - Assistant id
 * @returns {promise} - status string
 */
async function deleteAssistant(appControl, assistantid) {
  let { assistantApi, assistant, assistantName } = appControl;
  //delete specific assistant
  if (assistantid != null) {
    try {
      assistant = await assistantApi.getAssistant(assistantid);
    } catch (error) {
      console.log("Assistant not found, nothing to delete");
      return "Assistant not found, nothing to delete";
    }
  } else {
    // delete assistant by name
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
    if (assistant == null) {
      return "Assistant not found, nothing to delete";
    }
  }
  
  // found assistant - now delete associated thread and files
  try {
    console.log('assistant was found. Now deleting it');
    if (assistant.metadata.lastThread != null && assistant.metadata.lastThread.length > 0) {
      let status = await assistantApi.deleteThread(
        assistant.metadata.lastThread
      );
      console.log(`Thread ${assistant.metadata.lastThread} deleted`, status);
    }
  } catch (error) {
    console.log("Thread deletion failed. Probably does not exist", error);
  }
  // works with V2 of openai assistant
  try {
    if (assistant.metadata.vectorStoreid.trim().length > 0) {
      let status = await assistantApi.deleteVectorStore(assistant.metadata.vectorStoreid);
      console.log(
        `VectorStore ${assistant.metadata.vectorStoreid} deleted`,
        status
      );
    }
  } catch (error) {
    console.log("VectorStore deletion failed. Probably does not exist", error);
  }

  let f = assistant.metadata.files.trimStart();
  let files = f.split(' ');
  console.log('Files to delete:', files);
  for (let i = 0; i < files.length; i++) {
    if (files[i].trim().length > 0) {
      try {
        console.log("Deleting file:", files[i]);
        let r = await assistantApi.deleteFile(files[i]);
      } catch (error) {
        console.log(
          "Failed to delete file",
          files[i],
          "Probably does not exist"
        );
      }
    }
  }

  try {
    console.log("Deleting assistant:", assistant.name, assistant.id);
    let status = await assistantApi.deleteAssistant(assistant.id);
    appControl.assistant = null;
    appControl.assistantid = null;
    return `Assistant ${assistant.name} deleted`;
  } catch (error) {
    console.log("Failed to delete assistant. Probably does not exist", error);
  }

  return "Assistant deletion completed";
}
export default deleteAssistant;
