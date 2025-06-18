/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import getToken from './getToken.js';

async function config() {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
  let { host, token } = await getToken();
  let logonPayload = {
    authType: 'server',
    host: host,
    token: token,
      tokenType: 'bearer'
    };
    return logonPayload;
}

export default config;