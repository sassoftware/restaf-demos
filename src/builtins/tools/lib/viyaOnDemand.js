/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @description - Allow functions to create a Viya session on demand(if not already created)
 * @async
 * @function viyaOnDemand
 * @param {gptControl} gptControl  - gpt control object
 * @param {string} source  - cas|compute
 * @returns {promise} - appEnv - return appEnv
 * @example - Allow functions to create a Viya session on demand(if not already created)
 */

import restaf from "@sassoftware/restaf";
import restaflib from "@sassoftware/restaflib";

async function viyaOnDemand(gptConfig, source) {
  let { appEnv } = gptConfig;

 
  let store = appEnv.store;
  // if it is already created, return it
  let tappEnv=  {
    host: appEnv.host,
    logonPayload: appEnv.logonPayload,
    store:  appEnv.store,
    source: source,
    session: null,
    servers: null,
    serverName: null,
    casServerName: null,
    sessionID: null,
    restaf: restaf,
    restaflib: restaflib,
    restafedit: restafedit,
    viyaOnDemand: appEnv.viyaOnDemand
  }

  if (appEnv.source === "none") {
    return tappEnv;
  }

  if (appEnv[source].sessionID !== null) {
    return setupAppEnv(appEnv, tappEnv, source);
  }

  // source = cas
  if (source === "cas") {
    let { session, servers } = await restaflib.casSetup(store, null);
    let casServerName = session.links("execute", "link", "server");
    appEnv.cas = {
      session: session,
      servers: servers,
      casServerName: casServerName,
    };
    let ssid = await store.apiCall(session.links("self"));
    appEnv.cas.sessionID = ssid.items("id");
    tappEnv = setupAppEnv(appEnv, tappEnv, source);
    return tappEnv;
  }

  // source = compute
  if (source === "compute") {
    let { session, servers } = await restaflib.computeSetup(store, null);
    let serverName = session.links("execute", "link", "server");
    appEnv.compute = {
      session: session,
      servers: servers,
      serverName: serverName,
    };
    let sid = await store.apiCall(session.links("self"));
    appEnv.compute.sessionID = sid.items("id");
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
