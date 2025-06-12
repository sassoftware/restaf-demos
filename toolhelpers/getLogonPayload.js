/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import getToken from './getToken.js';
import debug from 'debug';
const log = debug('logonpayload');
function getLogonPayload() {
 
  let logonPayload = {
      host: process.env.VIYA_SERVER,
      authType: 'password',
      user: process.env.VIYA_USER,
      password: process.env.VIYA_PASSWORD,
      clientID: process.env.VIYA_CLIENTID,
      clientSecret: process.env.VIYA_CLIENTSECRET
    };

  // use this only in non-docker environments
  // need more configuration and code changes to make this work in docker
  if (process.env.USETOKEN.toLocaleUpperCase() === 'TRUE' ) {
    let {host, token} = getToken();
    logonPayload = {
      host: host,
      authType: 'server',
      token: token,
      tokenType: 'Bearer'
    };
  }

  log(`Using logon payload: ${JSON.stringify(logonPayload)}`);
  return logonPayload;
}
export default getLogonPayload;