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

 let restaf      = require('restaf');
 let fs          = require('fs');
let payload      = require('./config')('restaf.env');
let casSetup     = require('./lib/casSetup');
let runAction    = require('./lib/runAction');
let prtUtil      = require('../prtUtil');
let genCodeTable = requie('./getCodeTable')

let store   = restaf.initStore();
let srcPath = process.env[3];

async function  example(store, payload, actionSets) {
    let {session} = await casSetup(store, payload, actionSets);
    let srcCode = genCodeTable('casuser', 'codeTable', readFile(src));
    let r =  await runAction(store, session, p, 'codeTable');
   // run fetch action
    p = {
        action: 'table.fetch',
        data  : { table: { caslib: 'casuser', name: 'codeTable' } }
    } ;
    let actionResult = await runAction(store, session, p);
    let rows =actionResult.items('tables', 'Fetch', 'rows');
    console.log( JSON.stringify( rows, null, 4));
   //  prtUtil.view(actionResult, 'Result of fetch action');
    return 'done';
 };

example(store, payload, null)     
    .then ( r => console.log(r))
    .catch( err => console.log(err))

Function readFile (filename) {
    let data = fs.readFileSync(`./models/${filename}`);
    return data;
}


