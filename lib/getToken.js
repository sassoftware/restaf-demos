/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import fs from 'fs';
import os from 'os';
import qs from 'qs';
import axios from 'axios';
async function getToken() {
  let homedir = os.homedir();
  if (process.env.SAS_CLI_CONFIG) {
    homedir = process.env.SAS_CLI_CONFIG;
  }
  let sep = os.platform() === 'win32' ? '\\' : '/';
  let credentials = homedir + sep + '.sas' + sep + 'credentials.json';
  let url = homedir + sep + '.sas' + sep + 'config.json';
  try {
    let j = fs.readFileSync(credentials, 'utf8');
    let js = JSON.parse(j);
    let profile = process.env.SAS_CLI_PROFILE ? process.env.SAS_CLI_PROFILE : 'Default';
    let refresh_token = js[profile]['refresh-token'];
    j = fs.readFileSync(url, 'utf8');
    js = JSON.parse(j);
    let host = js[profile]['sas-endpoint'];
    let token = await refreshToken(refresh_token, host);
    return {
      host,
      token
    };
  } catch (e) {
    throw 'Error reading or parsing credentials/config file: ' + e;
  }
  async function refreshToken(token, host) {
    let config = {
      url: `${host}/SASLogon/oauth/token`,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: qs.stringify({
        grant_type: 'refresh_token',
        refresh_token: token,
        client_id: 'sas.cli'
      })
    };
    try {
      let r = await axios(config);
      return r.data.access_token;
    } catch (err) {
      console.log('Error refreshing token: ', JSON.stringify(err, null, 4));
      throw err;
    }
  }
}
export default getToken;