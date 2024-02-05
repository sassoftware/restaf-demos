/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
const fs = require('fs');
module.exports = function getToken() {
  let fs = require('fs');
  let authLoc = process.env.SASTOKEN;
  if (!authLoc) {
    authLoc = process.env['HOME'] + '/.sas/credentials.json';
  }
  try { 
    let j = fs.readFileSync(authLoc, 'utf8');
    let js = JSON.parse(j);
    let token = js.Default['access-token'];
    return token;
  } catch (e) {
    console.log('Error reading token from ' + authLoc);
    throw 'credentials file not found';
  }
}
