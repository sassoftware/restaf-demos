/*
 *  ------------------------------------------------------------------------------------
 *  * Copyright (c) SAS Institute Inc.
 *  *  Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  * http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  *  Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  limitations under the License.
 * ----------------------------------------------------------------------------------------
 *
 */

'use strict';

let restaf      = require('restaf');
let payload     = require('./config')('restaf.env');
let casSetup    = require('./casSetup');
let runAction   = require('./runAction');

let store = restaf.initStore();
async function casSession (store, payload, sessionName) {

    // logon

    let msg = await store.logon(payload);

    // get root end points of casManagement
    let root = await store.addServices('casManagement');

    // get list of current servers
    let servers = await store.apiCall(root.links('servers'));

    let casserver = servers.itemsList(0);
    console.log('Server --------------------------------');
    console.log(`Servername: ${casserver}`);

    let session     = await store.apiCall(servers.itemsCmd(casserver, 'createSession'),
                                      { data: { name: sessionName } });
    let sessionList = await store.apiCall(servers.itemsCmd(casserver, 'sessions'));

    console.log('List of current sessions --------------');
    sessionList.itemsList().map((id,l) => console.log(`${l} ${id}`));

    console.log('Transitions for a session --------------------');
    let links = session.links();
    links.forEach((c,rel) => {
        let uri = session.links(rel, 'link', 'uri');
        console.log(`${rel}   ${uri}`);
    });

    // using immutable js methods to navigate
    /*
    links.forEach((c,rel) => {
        let uri = c.getIn([ 'link', 'uri' ]);
        console.log(`${rel}   ${uri}`);
    });
    */

    return 'ok';
}

casSession(store, payload, 'last1')
    .then(r => console.log(r))
    .catch(err => console.log(err));
