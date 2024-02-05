/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

const restaf = require('@sassoftware/restaf');
const {casSetup, computeSetup} = require('@sassoftware/restaflib');
const getToken = require('./getToken');

module.exports = async function setup(source) {

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
    let {session, servers} = await casSetup(store, null)
    appEnv.session = session;
    appEnv.servers = servers;
  } else {
    appEnv.session = await computeSetup(store);
    appEnv.server = null;
  }
  return appEnv;
}