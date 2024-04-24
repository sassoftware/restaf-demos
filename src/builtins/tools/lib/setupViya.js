/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import restaf from '@sassoftware/restaf';
import restaflib from '@sassoftware/restaflib';
import restafedit from '@sassoftware/restafedit';
import getViyaSession from './getViyaSession.js';
 

/**
 * @description setup Viya access
 * @async
 * @private
 * @function setupViya
 * @param {object} viyaConfig  
 * @returns {promise}  - appEnv
 */


async function setupViya(viyaConfig) {
 let appEnv=  {
  host: null,
  logonPayload: viyaConfig.logonPayload,
  store: null,
  source: 'none',
  currentSource: 'none',
  session: null,
  servers: null,
  serverName: null,
  casServerName: null, 
  sessionID: null,
  compute: {
    sessionID: null,
  },
  cas: {
    sessionID: null
  },
  restaf: restaf,
  restaflib: restaflib,
  restafedit: restafedit,
  getViyaSession: getViyaSession,
  userData: viyaConfig.userData

}
if (viyaConfig.logonPayload !== null) {
  let logonPayload = viyaConfig.logonPayload;
  let store = restaf.initStore({casProxy: true});
  await store.logon(logonPayload);
  appEnv.host = logonPayload.host;
  appEnv.logonPayload = logonPayload;
  appEnv.store = store;
}
  
return appEnv;
}

export default setupViya;
