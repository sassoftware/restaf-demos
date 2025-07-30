/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import getToken from './getToken.js';
import debug from 'debug';

async function getLogonPayload() {
  const log = debug('logonpayload');
  if (process.env.USEPASSWORD === 'TRUE') {
    let logonPayload = {
        host: process.env.VIYA_SERVER,
        authType: 'password',
        user: process.env.VIYA_USER,
        password: process.env.VIYA_PASSWORD,
        clientID: process.env.VIYA_CLIENTID,
        clientSecret: process.env.VIYA_CLIENTSECRET
      };
      
    return logonPayload;
  }

  // need more configuration and code changes(mounting .sas folder) to make this work in docker

  try {
    let {host, token} = await getToken();
    let logonPayload = {
      host: host,
      authType: 'server',
      token: token,
      tokenType: 'Bearer'
    };
    console.error(`[Note] Using Viya host: `, host);
    return logonPayload;
  } catch (e) {
    console.error('[Error] Error getting token: ', e);
    process.exit(1);
  }

}
export default getLogonPayload;