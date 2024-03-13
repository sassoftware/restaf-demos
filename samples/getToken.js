/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// Reads token and host from the credentials file created by sas-viya auth login}loginCode
import fs from 'fs';
import os from 'os';
function getToken() {
  
  const homedir = os.homedir();
  if (process.env.SAS_CLI_CONFIG){
    homedir = process.env.SAS_CLI_CONFIG;
  }
  
  let sep = (os.platform() === 'win32') ? '\\' : '/';
  let credentials = homedir + sep + '.sas' + sep + 'credentials.json';
  let url = homedir + sep + '.sas' + sep + 'config.json';
  try { 
    let j = fs.readFileSync(credentials, 'utf8');
    let js = JSON.parse(j);
    let profile = (process.env.SAS_CLI_PROFILE) ? process.env.SAS_CLI_PROFILE : 'Default';
    let token = js[profile]['access-token'];
    j = fs.readFileSync(url, 'utf8');
    js = JSON.parse(j);
    let host = js[profile]['sas-endpoint'];

    console.log('Host set to ', host );
    return {host, token};
  } catch (e) {
    console.log('Error reading token from ' + authLoc);
    throw 'credentials file not found';
  }
  
}
export default getToken;
