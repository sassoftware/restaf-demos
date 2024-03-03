/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @async
 * @description - Cancel a previous run (on user request)
 * @function cancelRun
 * @params {object} client - client object
 * @params {object} thread - thread object
 * returns {promise} - status
 * @notes - This function will cancel the run
 */

async function cancelRun(client, thread, run) {
  let status = null;
  try {
    status = await client.beta.threads.runs.cancel(thread.id, run.id);
  } catch (error) {
    console.log("Error cancelling the run", error);
  }
  return status;
}