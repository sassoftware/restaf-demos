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
let payload     = require('./config')('restaf.env');
let casSetup    = require('./lib/casSetup');
let runAction   = require('./lib/runAction');
let prtUtil     = require('../prtUtil');
let genCodeTable = require('./lib/genCodeTable');
let src = `
     data casuser.temp;
     x=1;
     put x=;
     run;
     `

let store   = restaf.initStore();

async function  example(store, payload, actionSets) {
    let {session} = await casSetup(store, payload, actionSets);
    let code = genCodeTable('casuser', 'test', src);
    console.log(code);
    let p = {
        action: 'datastep.runCode',
        data  : { code: code, single:'YES'}
    };
    let r =  await runAction(store, session, p, 'Make codeTable');
   // run the code in the table

    p = {
        action: 'datastep.runcodetable',
        data: { 
            codeTable: {caslib: 'casuser', name: 'test'},
            single: 'YES'
        }
    }
    r =  await runAction(store, session, p, 'run codeTable');

    p = {
        action: 'table.fetch',
        data: { table: {caslib: 'casuser', name: 'temp'}}
    };
    r = await runAction(store, session, p, 'fetch results');
    let rows = r.items('tables', 'Fetch', 'schema');
    console.log( JSON.stringify( rows, null, 4));
    rows = r.items('tables', 'Fetch', 'rows');
    console.log( JSON.stringify( rows, null, 4));


    return 'done';
 };

example(store, payload, null)     
    .then ( r => console.log(r))
    .catch( err => console.log(err))


