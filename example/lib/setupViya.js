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

  let appEnv = {  
    host: null,
    logonPayload: null,
    store: null,
    session: null,
    servers: null,
    casServerName: null,
    source: source,
    sessionID: null
  }
  if (source === 'none'|| source == null){
    return appEnv;
  }
  // logon payload
  let {token, host} = getToken();
  let logonPayload = {
    authType: 'server',
    host: host,
    token: token,
    tokenType: 'bearer'
  }

  // logon to the server
  let store = restaf.initStore({casProxy: true});
  await store.logon(logonPayload);
  appEnv = {
    host: host,
    logonPayload: logonPayload,
    store: store,
    source: source
  }
  // create session and server objects
  if (source === 'cas') {
    let {session, servers} = await restaflib.casSetup(store, null);
    appEnv.session = session;
    appEnv.servers = servers;
    appEnv.casServerName = session.links("execute", "link", "server"); 
 
  } else {
    appEnv.session = await restaflib.computeSetup(store);
    appEnv.server = null;
  }

  let ssid = await store.apiCall(appEnv.session.links("self"));
  appEnv.sessionID = ssid.items("id");
  return appEnv;
}
export default setupViya;