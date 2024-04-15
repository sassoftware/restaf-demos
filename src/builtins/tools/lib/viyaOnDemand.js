/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @description - Allow functions to create a Viya session on demand(if not already created)
 * @async
 * @function viyaOnDemand
 * @param {gptControl} gptControl - gptControl object
 * @param {string} source  - cas|compute
 * @returns {promise} - appEnv - return appEnv
 * @example - Allow functions to create a Viya session on demand(if not already created)
 */

async function viyaOnDemand(gptControl, source) {
  let appEnv = gptControl.appEnv;
  let {restaflib} = appEnv;
  let store = appEnv.store;
  // if it is already created, return it
  let tappEnv=  {
    host: appEnv.host,
    logonPayload: appEnv.logonPayload,
    store:  appEnv.store,
    source: (source === 'sas') ? 'compute': source,
    session: null,
    servers: null,
    serverName: null,
    casServerName: null,
    sessionID: null,
    restaf: appEnv.restaf,
    restaflib: appEnv.restaflib,
    restafedit: appEnv.restafedit,
    viyaOnDemand: appEnv.viyaOnDemand
  }
 debugger;
  source = source.toLowerCase();
  if (source === 'sas') {source = 'compute'};
 

  if (['cas','compute'].includes(source) === false) {
    return tappEnv;
  }
  debugger;
  if (appEnv[source].sessionID != null) {
    tappEnv = setupAppEnv(appEnv, tappEnv, source);
    return tappEnv;
  }

  // source = cas
  if (source === "cas") {
    let { session, servers } = await restaflib.casSetup(store, null);
    let casServerName = session.links("execute", "link", "server");
    appEnv.cas = {
      session: session,
      servers: servers,
      casServerName: casServerName,
      serverName: casServerName
    };
    let ssid = await store.apiCall(session.links("self"));
    appEnv.cas.sessionID = ssid.items("id");

    tappEnv = setupAppEnv(appEnv, tappEnv, source);

    return tappEnv;
  }

  // source = sas
  if (source === 'compute') {
    let session = await restaflib.computeSetup(store, null);
    let sid = await store.apiCall(session.links("self"));
    appEnv.compute = {
      session: session,
      servers: null,
      serverName: null,
      sessionID: sid.items("id")
    };
    tappEnv = setupAppEnv(appEnv, tappEnv, source);
    return tappEnv;
  }
  function setupAppEnv(appEnv, tappEnv, source) {
      let lapp = appEnv[source];
      tappEnv.source = source;
      tappEnv.session = lapp.session;
      tappEnv.servers = lapp.servers;
      tappEnv.serverName = lapp.serverName;
      tappEnv.casServerName = lapp.casServerName;
      tappEnv.sessionID = lapp.sessionID;
    return tappEnv;
  }
}
export default viyaOnDemand;
