 /*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
 import { Agent, fetch } from 'undici';
 import getOpts from './getOpts.js';
 async function refreshToken(_appContext,params) {
  let {host, token} = params;
    const url = `${host}/SASLogon/oauth/token`;
    let opts = getOpts(_appContext);

    const agent = new Agent({
      connect: opts
    });
    
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: token,
      client_id: 'sas.cli'
    });
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          dispatcher: agent
        },
        body: body.toString()
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('[Error] Failed to refresh token: ', error);
        throw new Error(error);
      }

      const data = await response.json();
      
      return data.access_token;
    } catch (err) {
      console.error('[Error] Failed to refresh token: ', err);
      throw err;
    }
  }
  
  export default refreshToken;