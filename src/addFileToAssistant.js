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
 * @param {gptControl} gptControl - gptControl object

 * @returns {promise} - return { fileName: filename, fileId: file.id, assistantFileId: assistantFile.id};
 */
async function addFileToAssistant(filename, fileHandle, content, purpose, gptControl) {
  let { assistantApi, assistant, provider } = gptControl;

  // get fileid

  // really strange args for azure - not sure why they(both) coded it like this
  debugger;
  let file = null;
  try {
    debugger;
    console.log(assistantApi.uploadFile);
    console.log(purpose);
    console.log(filename);
    console.log(provider);
    file =
      provider === "openai"
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
    let assistantFile = await assistantApi.createAssistantFile(
      assistant.id,
      file.id
    );
    console.log("Assistant File ", assistantFile.id);
    await setFileIds(gptControl, assistantFile);
    return { fileName: filename, fileId: file.id, assistantFileId: assistantFile.id};
  } catch (e) {
    console.log(e);
    throw new Error(`Failed to upload file ${filename}`);
  }
  async function setFileIds(gptControl, file) {
    debugger;
    let { assistantApi, assistant, provider } = gptControl;
    let currentFileIds =
      provider === "openai" ? assistant.file_ids : assistant.fileIds;
    currentFileIds.push(file.id);
    // looks like it is possible to create a file with null file id
    currentFileIds = currentFileIds.filter((v) => v != null)
    let options = {
      fileIds: currentFileIds,
    };

    let metadata = assistant.metadata;
    try {
      metadata.files  = metadata.files + ' ' + file.id;
      options.metadata = metadata;
      let newAssistant = await assistantApi.updateAssistant(assistant.id, options);
      gptControl.assistant = newAssistant;
    } catch (e) {
      console.log(e);
      throw new Error(
        `Failed to update assistant with new file ${file.id}`
      );
    }
  }
}
export default addFileToAssistant;
