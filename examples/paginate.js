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

let restaf  = require('restaf');
let payload = require ('./config')('restaf.env') ;

let store = restaf.initStore();

// Pagination

async function example (store, logonPayload, counter) {
    await store.logon(logonPayload);
    let {files} = await store.addServices('files');

    let filesList = await store.apiCall(files.links('files'));
    //printList(filesList.itemsList());
    await delList(filesList);
    let next;
    // do this loop while the service returns the next link or counter is 0

    while(((next = filesList.scrollCmds('next')) !== null) && --counter > 0)  {
        filesList = await store.apiCall(next);
        await delList(filesList);
        }
        // printList(filesList.itemsList());
    return 'all done';
    }

async function delList(filesList) {
    for ( let i=0; i< filesList.itemsList().size - 1 ; i++) {
        let id   = filesList.itemsList(i);
        let name = filesList.items(id, 'name');
        console.log(name);
        if ( name.indexOf('.png') >=0 ){
           console.log('deleting');
           let delCmd = filesList.itemsCmd(id, 'delete');
           await store.apiCall(delCmd);
           console.log('delete complete');
        }  
    }
}
const printList =  (itemsList) => {
    console.log('------------------------------');
    itemsList.map(m => console.log(m));
    // you can also do console.log(JSON.stringify(itemsList, null,4))
}

example(store, payload, 10)
   .then (status => console.log(status))
   .catch(err => console.log(err));
