/**
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 *
 * Upload a file and attach it to the assistant
 * @param {object} fileHandle - from host file system
 * @param {string}  purpose - assistants|Fine-turning
 * @param {gptControl} gptControl - gptControl object
 * @returns {promise} - return the final file ids from the assistant
 */
async function uploadFile(filename, fileHandle, content, purpose, gptControl) {
  let { assistantApi, assistant, provider } = gptControl;

  // get fileid

  // really strange args for azure - not sure why they(both) coded it like this
  debugger;
  let file = null;
  try {
    file =
      provider === "openai"
        ? await assistantApi.uploadFile(fileHandle, purpose)
        : await assistantApi.uploadFile(content, purpose, {
            filename: filename,
          });

    // now add to the assistant
    console.log("uploaded file:", file.id);
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
    currentFileIds = currentFileIds.filter((v) => v != null);
    try {
      let opts = {
        fileIds: currentFileIds,
      };
      let newAssistant = await assistantApi.updateAssistant(assistant.id, opts);
      gptControl.assistant = newAssistant;
    } catch (e) {
      console.log(e);
      throw new Error(
        `Failed to update assistant with new file ${file.id}`
      );
    }
  }
}
export default uploadFile;
