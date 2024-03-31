/**
 * Copyright  © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import uploadFile from "./uploadFile.js";
async function makeFileObject(filename, content, mimeType, gptControl) {
  const blob = new Blob([content], { type: mimeType });
  console.log("blob", blob);
  const file = new File([blob], filename, { type: mimeType });
  console.log("file", file);
  try {

    let r = await uploadFile(filename, file, content, "assistants", gptControl);
    return r;
  } catch (err) {
    console.log(err);
    return {};
  }
}
export default makeFileObject;
