/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @async
 * @private
 * @description - Delete assistant
 * @function closeAssistant
 * @param {object} gptControl - gpt session control object
 * @param {object} assistantid - Assistant id
 * @returns {boolean} - true
 */
async function deleteAssistant(gptControl, assistantid) {
  console.log('in closeAssistant');
  let {assistantApi} = gptControl;
  let id = (assistantid) ? assistantid : gptControl.assistant.id;
  if (id != null) {
    let status = await assistantApi.deleteAssistant(id);
    return status;
  }
  // should we delete the thread associated with this assistant?
}
export default deleteAssistant;