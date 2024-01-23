/*
 * ------------------------------------------------------------------------------------
 *   Copyright (c) SAS Institute Inc.
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 * ---------------------------------------------------------------------------------------
 *
 */

"use strict";
/* --------------------------------------------------------------------------------
 * Logon to the Viya server
 * ---------------------------------------------------------------------------------
 */
let restaf = require('@sassoftware/restaf');
let config = require('./config');

let payload  = config();
let store = restaf.initStore();

runtest(payload) 
  .then (r => console.log(r))
  .catch(err =>{
    console.log(err);
    console.log(JSON.stringify(store.connection(), null, 4));
    return 'done'
  })
  .then(r => console.log(r))
  .catch(err => console.log(err));

async function runtest(ip) {
  console.log(ip);
   let msg = await store.logon(ip);
   console.log(JSON.stringify(store.connection(), null, 4));
   console.log(`Logon Status: ${msg}`);
 
   msg = await store.logoff();
   console.log(JSON.stringify(store.connection(), null, 4));
   console.log(`Logoff Status: ${msg}`);

   return 'done';
}