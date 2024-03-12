
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
async function uploadFile(fileHandle,purpose, gptControl) {
  let { assistantApi, assistant } = gptControl;

  // get fileid
  const fileId = await assistantApi.createFile({
    file: fileHandle,
    purpose: purpose})
  console.log('.......................', fileId); 
  
  debugger;
  let currentFileIds = [].concat(assistant.file_ids);
  currentFileIds.push(fileId.id);
  console.log(currentFileIds);
  debugger;
  try {
    let newAssistant = await assistantApi.updateAssistant(assistant.id, 
      {
      file_ids: currentFileIds
      });
    gptControl.assistant = newAssistant;
    debugger;
    console.log('.......................', newAssistant);
  } catch (e) {
    console.log(e);
  }
  return currentFileIds;
}
export default uploadFile;