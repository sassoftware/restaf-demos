/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @description - Allow functions to create a Viya session on demand(if not already created)
 * @function apiMapper
 * @param {gptControl} gptControl  - gpt control object
 * @param {string} source  - cas|compute
 * returns {promise} - appEnv - return appEnv
 * @example - Allow functions to create a Viya session on demand(if not already created)
 */

import restaf from "@sassoftware/restaf";
import restaflib from "@sassoftware/restaflib";

async function viyaOnDemand(gptConfig, source) {
  let { appEnv } = gptConfig;

  if (appEnv.currentSource === "none") {
    return null;
  }
  let store = appEnv.store;
  // if it is already created, return it
  if (appEnv[source].sessionID !== null) {
    let lapp = appEnv[source];
    appEnv.currentSource = source;
    appEnv.session = lapp.session;
    appEnv.servers = lapp.servers;
    appEnv.serverName = lapp.casServerName;
    appEnv.casServerName = lapp.casServerName;
    appEnv.sessionID = lapp.sessionID;
    appEnv.currentSource = source;
    return appEnv;
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
    appEnv.currentSource = source;
    appEnv.session = session;
    appEnv.servers = servers;
    appEnv.serverName = casServerName;
    appEnv.casServerName = casServerName;
    appEnv.sessionID = appEnv.cas.sessionID;
    return appEnv;
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
    let ssid = await store.apiCall(session.links("self"));
    appEnv.compute.sessionID = ssid.items("id");
    appEnv.currentSource = source;
    appEnv.session = session;
    appEnv.servers = servers;
    appEnv.serverName = serverName;
    appEnv.sessionID = appEnv.compute.sessionID;
    return appEnv;
  }
}
export default viyaOnDemand;
