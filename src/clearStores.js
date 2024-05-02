/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @async
 * @private
 * @description - Deletes upto 100 vector stores
 * @function clearStores
 * @param {appControl} appControl - gpt session control object
 * @returns {promise} - status string
 * @example
 * This is a convenience function. With V2 of openai assistant, there can be a proliferation of vector stores
 * if they are not managed properly. This function will delete all but the current vector store
 * 
 */

async function clearStores(appControl) {
  let { assistantApi } = appControl;

  let vs = await assistantApi.listVectorStores({
    limit: 100,
  });
 
  let list = vs.body.data;
  for (let i = 0; i < list.length; i++) {
    let l = list[i];
    console.log(l.name, l.id);
    if (l.id !== appControl.vectorStoreid) {
      try {
        let r = await assistantApi.deleteVectorStore(l.id);
      } catch (error) {
        console.log("Failed to delete vector store", l.id, error);
      }
    }
  }
  return `Deleted ${list.length} stores`;
}

export default clearStores;
