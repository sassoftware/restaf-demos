
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
async function uploadFile(filename, fileHandle,content, purpose, gptControl) {
  let { assistantApi, assistant, provider } = gptControl;

  // get fileid

 
  // really strange args for azure - not sure why they(both) coded it like this
  debugger;
  let fileId = (provider === 'openai') 
              ? await assistantApi.uploadFile(fileHandle,purpose)
              : await assistantApi.uploadFile(content, purpose, {filename: filename});
  
  
    // update the array of file ids in the assistant
  let currentFileIds = [].concat(assistant.file_ids);
  currentFileIds.push(fileId.id);
  console.log('currentFiles ', currentFileIds);
  
  // looks like it is possible to create a file with null file id
  currentFileIds = currentFileIds.filter((v) => v != null);
  /*
  if (gptControl.retrievalFlag === false){
    return currentFileIds;
  }
  */
    // update assistant with the new array of  the fileids
    try {
      debugger;
      let opts = {
        fileIds: currentFileIds
      };
      let newAssistant = await assistantApi.updateAssistant(assistant.id, opts);
      gptControl.assistant = newAssistant;
    } catch (e) {
      console.log(e);
      throw new Error(`Failed to update assistant with new file ${filename}`);
    }

  return {notes: (gptControl.retrievalFlag)? "Retrieval enabled" : "Retrieval disabled"}, currentFileIds;
}
export default uploadFile;