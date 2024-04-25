/**
 * Copyright  © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @description make a file object from a string
 * @async
 * @function createFile
 * @param {string} filename - name of the file
 * @param {string} content - content of the file
 * @param {string} mimeType - mime type of the file
 * @param {string} purpose - assistants|Fine-turning|null
 * @param {object} appControl - appControl object
 * @returns {promise} - file object
 
 */
import addFileToAssistant from "./addFileToAssistant.js";
async function createFile(filename, content, mimeType,purpose, appControl) {
  const blob = new Blob([content], { type: mimeType });
  const file = new File([blob], filename, { type: mimeType });
  
  console.log(blob);
  try {
    
    let r = await addFileToAssistant(filename, file, content, purpose, appControl);
    return r;
  } catch (err) {
    console.log(err);
    return {};
  }
}
export default createFile;
