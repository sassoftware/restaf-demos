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
 * Run a cas data step and then retrieve the created table
 */
'use strict';

let restaf         = require('restaf');
let casSetup    = require('../lib/casSetup');
let runAction   = require('../lib/runAction');
let prtUtil        = require('../../prtUtil');

let payload = require('./config')('restaf.env');
let store   = restaf.initStore();

async function example (store, payload, actionSets){

    let {session} = await casSetup(store, payload, actionSets);

    let actionPayload = {
        action: 'datastep.runCode',
        data  : { code: 'data casuser.score; x1=10;x2=20;x3=30; score1 = x1+x2+x3;run; '  }
    };
    await runAction(store, session, actionPayload, 'Data Step');

   // run fetch action
    actionPayload = {
        action: 'table.fetch',
        data  : { table: { caslib: 'casuser', name: 'score' } }
    };
    let actionResult = await runAction(store, session, actionPayload);
    prtUtil.view(actionResult, 'Result of fetch action');

    // delete session
    await store.apiCall(session.links('delete'));

    console.log(`session closed with Status Code ${actionResult.status}`);
    return true;
}

example(store, payload, null)
    .then(r => prtUtil.print({Status: 'All Done'}))
    .catch(err => prtUtil.printErr(err));




