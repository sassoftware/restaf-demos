/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import fs from 'fs';
import os from 'os';

import { Agent, fetch } from 'undici';
import getOpts from './getOpts.js';

async function getToken(_appContext) {
  let homedir = os.homedir();
  if (_appContext.SAS_CLI_CONFIG) {
    homedir = _appContext.SAS_CLI_CONFIG;
  }

  let sep = (os.platform() === 'win32') ? '\\' : '/';
  let credentials = homedir + sep + '.sas' + sep + 'credentials.json';
  let url = homedir + sep + '.sas' + sep + 'config.json';
 
  try {
    let j = fs.readFileSync(credentials, 'utf8');
   
    let js = JSON.parse(j);
    let profile = (_appContext.SAS_CLI_PROFILE == null || _appContext.SAS_CLI_PROFILE.toLowerCase() === 'default')
           ? 'Default' : _appContext.SAS_CLI_PROFILE;

    let refresh_token = js[profile]['refresh-token'];
    j = fs.readFileSync(url, 'utf8');
    js = JSON.parse(j);
    let host = js[profile]['sas-endpoint'];

    let token = await refreshToken(refresh_token, host);
    return { host, token };
  } catch (e) {
    console.error(e);
    throw '[Error] Failed to read credentials/config file: ' + e;
  }
  async function refreshToken(token, host) {
    const url = `${host}/SASLogon/oauth/token`;
    let opts = getOpts();

    const agent = new Agent({
      connect: getOpts()
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

}
export default getToken;
