/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @async
 * @private
 * @description - find assistant by name
 * @function assistantByName
 * @params {string} name - assistant name
 * @param {appControl} appControl - gpt  session control object
 * returns {promise} - status (null if no run or thread or failed to cancel)
 * @example - find an assistant by name
 */
async function assistantByName(name, appControl) {
  console.log("Attempting to find assistant by name ", name);
  let assistant = null;
  const myAssistants = await appControl.assistantApi.listAssistants({
    order: "desc",
    limit: "100",
  });
  assistant = myAssistants.data.find((a) => {
    if (a.name === name) {
      return a;
    }
  });
  console.log("assistant found", assistant.name, assistant.id)
  return assistant;
}
export default assistantByName;