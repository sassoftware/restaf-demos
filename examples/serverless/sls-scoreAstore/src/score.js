'use strict';
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
let restaf = require('restaf');
let scoreMain   = require('./scoreMain');
let getPayload  = require('../lib/getPayload');
let setPayload    = require('../lib/setPayload');
let setError = require('../lib/setError');

//
// Get Viya logon info from environment variables and logon to Viya Server 
// Follow that by handling the call
//  Note how an error is returned as "normal" result but with statusCode set to some http error condition(ex: 400)
// There are better ways to handle error conditions in AWS but for pass 1 this is good enough
//
module.exports.score = async function (event, context ) {
    debugger;
   let store   = restaf.initStore();
   let payload = getPayload();

   return store.logon(payload)
        .then (()    => scoreMain( store, event, context))
        .then(result => setPayload(result))
        .catch(err   => setError(err))
}
