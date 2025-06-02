/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
function getLogonPayload() {
 
  let logonPayload = {
    host: process.env.VIYA_SERVER,
    authType: "password",
    user: process.env.VIYA_USER || 'sasdemo',
    password: process.env.VIYA_PASSWORD || 'sasdemo',
    clientID: process.env.VIYA_CLIENTID || 'mcppw',
    clientSecret: process.env.VIYA_CLIENTSECRET || 'mcppw'
  };
  return logonPayload;
}
export default getLogonPayload;