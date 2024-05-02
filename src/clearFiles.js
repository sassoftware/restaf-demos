/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @async
 * @private
 * @description - Deletes files
 * @function clearFiles
 * @param {appControl} appControl - gpt session control object
 * @returns {promise} - status string
 * @example
 * This is a convenience function. With V2 of openai assistant, there can be a proliferation of vector stores
 * if they are not managed properly. This function will delete all but the current vector store
 *
 */

async function clearFiles(appControl) {
  let { assistantApi } = appControl;

  let vs = await assistantApi.listFiles({
    purpose: 'assistants',
  });

  let list = vs.body.data;
  for (let i = 0; i < list.length; i++) {
    let l = list[i];
    console.log(l.filename, l.id);
    try {
      let r = await assistantApi.deleteFile(l.id);
    } catch (error) {
      console.log("Failed to delete file", l.id, error);
    }
  }
  return `Deleted ${list.length} files`;
}

export default clearFiles;
