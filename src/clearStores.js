/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @async
 * @private
 * @description - Deletes vector stores
 * @function clearStores
 * @param {appControl} appControl - gpt session control object
 * @returns {promise} - status string
 * 
 */

async function clearStores(appControl) {
  let { assistantApi } = appControl;

  do {
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
  } while (list.length > 0);
  
  return `Stores deleted`;
}

export default clearStores;
