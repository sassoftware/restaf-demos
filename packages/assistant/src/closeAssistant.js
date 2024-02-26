/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @async
 * @description - Close Viya connections.
 * @function closeAssistant
 * @param {object} gptControl - gpt session control object
 * @param {object} appEnv - Viya session control object(has store, sessionID, etc. to talk to Viya server)
 * @returns {boolean} - true
 */
async function closeAssistant(_gptControl, _appEnv) {
  return true;
}
export default closeAssistant;