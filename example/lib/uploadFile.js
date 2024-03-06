
/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import fs from "fs";
async function uploadFile(params, _appEnv, gptControl) {
  let { filename, purpose} = params;
  let { client, assistant } = gptControl;

  // get fileid
  const fileId = await client.files.create({
    file: fs.createReadStream(filename),
    purpose: purpose})
  console.log('.......................', fileId); 
  
  debugger;
  let currentFileIds = [].concat(assistant.file_ids);
  currentFileIds.push(fileId.id);
  console.log(currentFileIds);
  debugger;
  try {
    let newAssistant = await client.beta.assistants.update(assistant.id, 
      {
      file_ids: currentFileIds
      });
    gptControl.assistant = newAssistant;
    debugger;
    console.log('.......................', newAssistant);
  } catch (e) {
    console.log(e);
  }
  return currentFileIds
}
export default uploadFile;