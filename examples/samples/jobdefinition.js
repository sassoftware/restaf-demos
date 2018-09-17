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

// running a  compute job

'use strict';

let restaf      = require('restaf');
let payload     = require('./config')('restaf.env');

let store = restaf.initStore();

async function example (store, logonPayload) {

    let apiCall = store.apiCall ;
    // logon;
    
    let msg = await store.logon(logonPayload);

    // get root end points, get list of contexts and create a sessuin ysubg the first context
    let {jobDefinitions, jobExecution} = await store.addServices('jobDefinitions');

    let p = {
        qs: {
            filter: `eq(name,'Copy CasTable')`
        }
    }
    let level1 = await store.apiCall(jobDefinitions.links('job-definitions'), p);
    console.log( JSON.stringify(level1.itemsList(), null, 4));
    let a = await store.apiCall(level1.itemsCmd(level1.itemsList(0), 'self' ));
    console.log(JSON.stringify(a.items('parameters', 0), null, 4));
    console.log('--------------------------');
    let content = a.items().toJS();
    console.log(JSON.stringify(content.parameters[0], null, 4));

    return 'All Done';
}


// Run the example
example(store, payload)
    .then  (status  => console.log(status))
    .catch (err => console.log(err));



