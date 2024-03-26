/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @async
 * @description - Delete assistant
 * @function closeAssistant
 * @param {gptControl} gptControl - gpt session control object
 * @param {object} [assistantid] - Assistant id
 * @returns {promise} - status string 
 */
async function deleteAssistant(gptControl, assistantid) {
  let { assistantApi, assistant } = gptControl;

  if (assistantid != null) {
    try {
      if (assistantid != null) {
        await assistantApi.deleteAssistant(id);
        return `Assistant ${assistantid} deleted.`
      }
    } catch (error) {
      console.log(error);
      throw new Error(`
        Delete of assistant ${assistantid} failed`);   
    }
  }

  try {
    if (assistant.metadata.lastThread != null) {
      let status = await assistantApi.deleteThread(assistant.metadata.lastThread);
      console.log('Thread ${assistant.metadata.lastThread} deleted', status);
      status = await assistantApi.deleteAssistant(assistant.id);
      console.log(`Assistant ${assistant.name} deleted`, status);
      gptControl.assistant = null;
      gptControl.assistantid = '0';
      return `Assistant ${assistant.name} deleted`;

    }
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to delete session and thread
    ${error}`);
  }

}
export default deleteAssistant;
