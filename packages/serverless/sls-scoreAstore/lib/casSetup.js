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


module.exports = async function casSetup (store, actionSets) {
debugger;
let { casManagement } = await store.addServices('casManagement');

let servers = await store.apiCall(casManagement.links('servers'));
let p = { data: { name: 'raf' } };
let serverName = servers.itemsList(0);

let session = await store.apiCall(servers.itemsCmd(serverName, 'createSession'), p);
// let executeAction = session.links('execute');

if (actionSets !== null){
        let l = actionSets.length;
        for ( let i = 0; i < l ; i++){
        let p = {
                action: 'builtins.loadActionSet',
                data: { actionSet: actionSets[i]}
        };
        await store.runAction(store, session, p);
       // console.log( `${actionSets[i]} has been loaded`)
        }
}
return {servers: servers, session: session}
}



