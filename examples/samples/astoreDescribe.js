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

'use strict';


let restaf     = require('restaf');
let payload = require('./config')('restaf.env') ;
let store   = restaf.initStore();
let prtUtil = require('../../prtUtil');
let casSetup    = require('../lib/casSetup');
let runAction  = require('../lib/runAction');

 /* --------------------------------------------------------------------------------
 * Logon to the restaf server and setup file service
 * ---------------------------------------------------------------------------------
 */

async function setup (payload, actionSets) {
    let {session} = await casSetup(store, payload, actionSets);
    let parms = {
        rstore: { caslib: 'casuser', name: 'paysimsvdd.sasast'}
     };
   
     // get description
     let actionPayload = { 
         action: 'aStore.describe', 
         data: parms 
         };
    let actionResult = await runAction(store, session, actionPayload, 'describe');
    console.log(JSON.stringify(actionResult.items(), null, 4));
    return true;
    }

setup(payload, ['astore'])

   .then (r => console.log(r))
   .catch(e => console.log(e));
