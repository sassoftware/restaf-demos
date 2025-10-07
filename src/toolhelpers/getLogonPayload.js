/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import getToken from './getToken.js';

async function getLogonPayload() {

  if (process.env.AUTHFLOW === 'password') {
    let logonPayload = {
        host: process.env.VIYA_SERVER,
        authType: 'password',
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        clientID: process.env.CLIENTIDPW,
        clientSecret: process.env.CLIENTSECRETPW
      };
      
    return logonPayload;
  }

  if (process.env.AUTHFLOW === 'token') {
    let logonPayload = {
        host: process.env.VIYA_SERVER,
        authType: 'token',
        token: process.env.TOKEN,
        tokenType: 'Bearer'
      };
    return logonPayload;
    }
  // need more configuration and code changes(mounting .sas folder) to make this work in docker
  //AUTHFLOW=sascli
  try {
    console.error('[Note] calling getToken()');
    let {host, token} = await getToken();
    console.error('[Note] got token from getToken() for host ', host);
    let logonPayload = {
      host: host,
      authType: 'server',
      token: token,
      tokenType: 'Bearer'
    };
    console.error(`[Note]...... Using Viya host: `, host);
    return logonPayload;
  } catch (e) {
    console.error('[Error].... Error getting token: ', e);
    process.exit(1);
  }

}
export default getLogonPayload;