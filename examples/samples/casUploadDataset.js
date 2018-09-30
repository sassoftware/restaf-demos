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

let restaf        = require('restaf');
let fs            = require('fs');
let prtUtil       = require('../../prtUtil');
let casSetup      = require('../lib/casSetup');
let runAction     = require('../lib/runAction');
let printCasTable = require('../lib/printCasTable');

let payload     = require('./config')('restaf.env');
let filename    = 'GRADIENT_BOOSTING___BAD_2';
let fileType    = 'HDAT';

let store = restaf.initStore();

async function example () {

    // setup session

    let {session} = await casSetup(store, payload, null);

    // setup header for upload and the rest of the payload
    let JSON_Parameters = {
        casout: {
            caslib: 'casuser', /* a valid caslib */
            name  : filename /* name of output file on cas server */
        },

        importOptions: {
            fileType: fileType /* type of the file being uploaded */
        }
    };

    let p = {
        headers: {'JSON-Parameters': JSON_Parameters},
        data   : readFile(filename),
        action : 'table.upload'
    };

    await runAction(store, session, p, 'table.upload');

    let parms = {
        caslib : 'casuser',
        name   : filename,
        replace: true,
        table: {
            caslib: 'casuser',
            name  : filename
        }
    };
    payload ={action: 'table.save', data: parms};
    await runAction(store, session, payload, 'save');

    p = {
        action: 'table.tableExists',
        data  : { caslib: 'casuser', name: filename }
    };
    await runAction(store, session, p, 'exists');

    p = {
        action: 'table.fetch',
        data  : { table: { caslib: 'casuser', name: filename } }
    };
    let result = await runAction(store, session, p, 'table.fetch');
    console.log(JSON.stringify(result.items('tables'), null, 4));
    printCasTable(result, 'Fetch');
  

    // noinspection JSUnusedLocalSymbols
    let deleteAction = await store.apiCall(session.links('delete'));


    return "All Done";
}

function readFile (filename) {
   let data = fs.readFileSync(`./data/sasdata/${filename}.sashdat`);
    return data;
}

example()
    .then (r => console.log(r))
    .catch(err => console.log(err));
