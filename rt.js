/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import fs from 'fs';
import os from 'os';
import axios from 'axios';
import qs from 'qs';


const homedir = os.homedir();
if (process.env.SAS_CLI_CONFIG) {
    homedir = process.env.SAS_CLI_CONFIG;
}

let sep = (os.platform() === 'win32') ? '\\' : '/';
let credentials = homedir + sep + '.sas' + sep + 'credentials.json';
let url = homedir + sep + '.sas' + sep + 'config.json';

let j = fs.readFileSync(credentials, 'utf8');
let js = JSON.parse(j);
let profile = (process.env.SAS_CLI_PROFILE) ? process.env.SAS_CLI_PROFILE : 'Default';
let token = js[profile]['refresh-token'];
console.log('refresh_token', token);
j = fs.readFileSync(url, 'utf8');
js = JSON.parse(j);
let host = js[profile]['sas-endpoint'];
// process.env.VIYA_SERVER = host;
//console.log('Host set to ', host );
let newToken = null;
refreshToken(token, host)
    .then(r => { console.log('Token refreshed successfully'); newToken = r; })
    .catch(err => { console.log(err) })

async function refreshToken(token, host) {
    let config = {
        url: `${host}/SASLogon/oauth/token`,
        method: 'POST',

        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify({
            grant_type: 'refresh_token',
            refresh_token: token,
            client_id: 'sas:ec',
            client_secret: ''
        })
    };
    try {
        let r = await axios(config);
        console.log('Token refreshed successfully');
        return r.data.access_token;

    }
    catch (err) {
        console.log('Error refreshing token: ', JSON.stringify(err, null, 4));
        return null;
    }

}

