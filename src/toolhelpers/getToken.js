/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import fs from 'fs';
import os from 'os';
import refreshToken from './refreshToken.js';
async function getToken(_appContext) {
  let homedir = os.homedir();
  if (_appContext.SAS_CLI_CONFIG) {
    homedir = _appContext.SAS_CLI_CONFIG;
  }
  debugger;
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

    let token = await refreshToken(_appContext,{token: refresh_token, host: host});
    return { host, token };
  } catch (e) {
    console.error(e);
    throw '[Error] Failed to read credentials/config file: ' + e;
  }
 
}
export default getToken;
