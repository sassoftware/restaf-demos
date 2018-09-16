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

let fs = require('fs');

let config  = require('./examples/config')('restaf.env');
let sls     = require(`./examples/serverless/${process.env.SLS}`);
let context = null;
let event   = {};

let slsPath    = process.env.SLSPATH;
let slsPayload = process.env.SLSPAYLOAD;

if ( slsPayload != null ) {
   event = {body: fs.readFileSync(slsPayload, 'utf8') };
}

sls[slsPath](event, context)
  .then ( r => {
    let body = JSON.parse(r.body);
    console.log(JSON.stringify(body, null, 4));
  })
  .catch( err => console.log(JSON.stringify(err, null,4)));





