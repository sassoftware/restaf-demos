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


async function setupViya(source, logonPayload) {

 let appEnv=  {
  host: null,
  logonPayload: null,
  store: null,
  source: 'none',
  currentSource: source,
  session: null,
  servers: null,
  serverName: null,
  casServerName: null, 
  sessionID: null,
  compute: {},
  cas: {}
}
  
if (source === 'none'){
  return appEnv;
}
appEnv.host= logonPayload.host;
  // get list of sources. First one in list is the default
  let sources = source.split(',');
  let defaultSource = sources[0];

  // logon to the server
  let store = restaf.initStore({casProxy: true});
  await store.logon(logonPayload);
  appEnv.host = logonPayload.host;
  appEnv.logonPayload = logonPayload;
  appEnv.store = store;
  
  // create session and server objects
  // Allow sessions for both servers and cas
  
  // cas service
  if (source.indexOf('cas') >= 0 ) {
    let {session, servers} = await restaflib.casSetup(store, null);
    let casServerName = session.links('execute', 'link', 'server');
    appEnv.cas = {
      session: session,
      servers: servers,
      casServerName: casServerName
    }
    let ssid = await store.apiCall(session.links('self'));
    appEnv.cas.sessionID = ssid.items('id');
    if (defaultSource === 'cas') {
      appEnv.source = 'cas';
      appEnv.session = session;
      appEnv.servers = servers;
      appEnv.serverName = casServerName;
      appEnv.casServerName = casServerName;
      appEnv.sessionID = appEnv.cas.sessionID;
    }
  } 

  // compute service
  if (source.indexOf('compute') > 0) {
    appEnv.compute = {
      servers: null
    }
    let session = await restaflib.computeSetup(store);
    let ssid = await store.apiCall(appEnv.session.links('self'));
    appEnv.compute.sessionID = ssid.items('id');
    if (defaultSource === 'compute') {
      appEnv.source = 'compute';
      appEnv.session = session;
      appEnv.servers = null;
      appEnv.serverName = null;
      appEnv.sessionID = appEnv.compute.sessionID;
    }
  }
  console.log(appEnv);
  return appEnv;
}
export default setupViya;