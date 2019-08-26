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
 * Sentiment Analysis using casActions
 */
'use strict';

let restaf         = require('restaf');
let payload     = require('./config')('restaf.env');
let casSetup    = require('../lib/casSetup');

let prtUtil        = require('../../prtUtil');

let store   = restaf.initStore();

async function example (store, payload, actionSets){

    //setup CAS session
    let {session} = await casSetup(store, payload, actionSets);

    let p = {
        action: 'datastep.runCode',
        data  : { code: `data casuser.text;docId='test';text='this is very good stuff';run;`  }
    };
    await store.runAction(store, session, p, 'Data Step');
    //run data step action
    let actionPayload = {
        action: 'sentimentAnalysis.applySent',
        data: {
            casout: {
                caslib: 'casuser',
                name  : 'sentiments'
            },
            table: {
                caslib: 'casuser',
                name  : 'text'
            },
            text : 'text',
            docId: 'docId'
        }
    };
    

    let actionResult = await store.runAction(store, session, actionPayload, 'sentiment Analysis');
    prtUtil.view(actionResult, 'Result from sentiment analysis');

    actionResult = await store.apiCall(session.links('delete'));

    console.log(`session closed with Status Code ${actionResult.status}`);
    return true;
}

example(store, payload, ['sentimentAnalysis'])
    .then(r => prtUtil.print({Status: 'All Done'}))
    .catch(err => prtUtil.printErr(err));




