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
 let appEnv=  {
  host: null,
  logonPayload: null,
  store: null,
  source: 'none',
  currentSource: null,
  session: null,
  servers: null,
  serverName: null,
  sessionID: null,
  compute: {},
  cas: {}
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
  appEnv.host = host;
  appEnv.logonPayload = logonPayload;
  appEnv.store = store;
  
  // create session and server objects
  // Allow sessions for both servers and cas
  if (source.indexOf('cas') >= 0 ) {
    let {session, servers} = await restaflib.casSetup(store, null);
    let casServerName = session.links('execute', 'link', 'server');
    appEnv.cas = {
      session: session,
      servers: servers,
      casServerName: casServerName
    }
    let ssid = await store.apiCall(appEnv.session.links('self'));
    appEnv.cas.sessionID = ssid.items('id');
  } 

  if (source.indexOf('compute') > 0) {
    appEnv.compute = {
      servers: null
    }
    appEnv.compute.session = await restaflib.computeSetup(store);
    let ssid = await store.apiCall(appEnv.session.links('self'));
    appEnv.compute.sessionID = ssid.items('id');
  }
 
  return appEnv;
}
export default setupViya;