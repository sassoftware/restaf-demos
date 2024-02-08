/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Setup the Viya environment
 * @param {string} source - cas or compute
 * @returns {object} - appEnv
 * @async
 */
 
import restaf from '@sassoftware/restaf';
import restaflib from '@sassoftware/restaflib';
import getToken from './getToken.js';

async function setupViya(source) {

  if (source === 'none'){
    return {source: 'none'}
  };
  // logon payload
  let logonPayload = {
    authType: 'server',
    host: process.env.VIYA_SERVER,
    token: getToken(),
    tokenType: 'bearer'
  }

  // logon to the server
  let store = restaf.initStore({casProxy: true});
  let msg = await store.logon(logonPayload);
  let appEnv = {
    host: process.env.VIYA_SERVER,
    store: store,
    source: source
  }
  // create session and server objects
  if (source === 'cas') {
    let {session, servers} = await restaflib.casSetup(store, null)
    appEnv.session = session;
    appEnv.servers = servers;
    appEnv.casServerName = session.links("execute", "link", "server");
    appEnv.serverName = session.links("execute", "link", "server");
  } else {
    appEnv.session = await restaflib.computeSetup(store);
    appEnv.server = null;
  }

  return appEnv;
}
export default setupViya;