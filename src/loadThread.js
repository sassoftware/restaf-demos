/*
 * Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @async
 * @function loadThread
 * @description   new thread or open existing thread
 * @params {object} client - client object
 * @param {object} config - configuration object
 * @returns {promise} - return thread object
 */
async function loadThread(client, config) {
  let {threadid} = config; 
  let thread = null;
  // If we are reusing the thread, try to retrieve it
  try {
    thread = (threadid === '0') 
      ? await client.beta.threads.create({ metadata: { assistantName: assistant.name }})
      : await client.beta.threads.retrieve(threadid);
  } catch (error) {
    console.log(error); 
    console.log(error.status);
    throw new Error(`Error status ${error.status}. Unable to retrieve the thread ${threadid}. see console for details.`);
  }
  debugger;
  return thread;
}
export default loadThread;
