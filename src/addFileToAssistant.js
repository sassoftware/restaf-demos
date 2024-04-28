/**
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/**

 * @async
 * @private
 * @function addFileToAssistant
 * @description upload a file and add it to the assistant file list
 * @param {string} filename - name of the file
 * @param {object} fileHandle - from host file system
 * @param {string} content - content of the file
 * @param {string} purpose - assistants|Fine-turning
 * @param {appControl} appControl - appControl object

 * @returns {promise} - return { fileName: filename, fileId: file.id, assistantFileId: assistantFile.id};
 */
async function addFileToAssistant(filename, fileHandle, content, purpose, appControl) {
  let { assistantApi, assistant, provider } = appControl;

  // get fileid

  // really strange args for azure - not sure why they(both) coded it like this
  
  let file = null;
  
  try {
    file =
      (provider === "openai")    
        ? await assistantApi.uploadFile(fileHandle, purpose)
        : await assistantApi.uploadFile(content, purpose, {
            filename: filename,
          });

    // now add to the assistant
    console.log("uploaded file:", file.id);
    

    /* do not attach to assistant  if purpose is null*/
    if (purpose === null) {
      return { fileName: filename, fileId: file.id, assistantFileId: null};
    }
    let assistantFile = null;
    if (provider === "azureai") {
      
      assistantFile = await assistantApi.createAssistantFile(
        assistant.id,
        file.id
      );
      
      await setFileIds(appControl, file);
      return { fileName: filename, fileId: file.id, assistantFileId: assistantFile.id};

    } else {
      let vsFile = await assistantApi.createVectorStoresFiles(
        appControl.vectorStoreid,
        {file_id: file.id}
      );
      console.log("VectorStore File ID ", file.id);
      await setFileIds(appControl, file);
      return { fileName: filename, fileId: file.id, vectorStoreFileId: vsFile.id};

      }
  
  } catch (e) {
    console.log(e);
    throw new Error(`Failed to upload file ${filename}`);
  }
  async function setFileIds(appControl, file) {
    
    let { assistantApi, assistant, provider } = appControl;
    let currentFileIds = provider === "openai" ? assistant.file_ids : assistant.fileIds;

    // do not update fileid array for openai
    if (provider === "azureai") {
      currentFileIds.push(file.id);
    } else {
      currentFileIds = [];
    }
    if (currentFileIds.length == null) {
      currentFileIds = [];
    }
    let options = {
      file_ids: currentFileIds,
    };
  
    let metadata = assistant.metadata;
    try {
      metadata.files = metadata.files + " " + file.id;
      options.metadata = metadata;
      let newAssistant = await assistantApi.updateAssistant(
        assistant.id,
        options
      );
      appControl.assistant = newAssistant;
      appControl.assistantid = newAssistant.id;
    } catch (e) {
      console.log(e);
      throw new Error(
        `Failed to update assistant with new file ${file.id}`
      );
    }
   
  }
}
export default addFileToAssistant;
