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
/*
 * running a simple data step in CAS
 */
'use strict';

let restaf      = require('restaf');
let payload     = require('./config')('restaf.env');
let casSetup    = require('./lib/casSetup');
let runAction  = require('./lib/runAction');
let listCaslibs = require('./lib/listCaslibs');
let printCasTable = require('./lib/printCasTable');
let prtUtil     = require('../prtUtil');

let store = restaf.initStore();

async function example (store, logonPayload, actionSets) {

    let {session} = await casSetup(store, logonPayload, actionSets);
    let p = {
        action: 'datastep.runCode',
        data  : { code: 'data casuser.score; x1=10;x2=20;x3=30; score1 = x1+x2+x3;run; '  }
    };
    await runAction(store, session, p, 'Data Step');

    p = {
        action: 'table.tableExists',
        data  : { caslib: 'casuser', name: `score` }
    };
    await runAction(store, session, p, 'exists');

    p = {
        action: 'table.fetch',
        data  : { table: { caslib: 'casuser', name: 'score' } }
    };

    let fetchResult = await runAction(store, session, p, 'Fetch');
    printCasTable(fetchResult, 'Fetch');

    p = {
        action: 'table.tableDetails',
        data  : { caslib: 'casuser', name: `score` }
    };
    await runAction(store, session, p, 'details');

    return 'Success';
}

// Run the example
example(store, payload, null)
    .then  (msg => console.log(msg))
    .catch (err => prtUtil.printErr(err));



