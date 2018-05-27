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

let restaf   = require('restaf');
let fs       = require('fs');
let path     = require('path');
let casSetup = require('./lib/casSetup');

let runAddTable = require('./lib/runAddTable');

let payload   = require('./config')('restaf.env');
let datadir   = './data/images';
let worklib   = 'casuser';
let imageName = 'img_55.jpg'
let tableName = 'images';


let store = restaf.initStore();

//TBD: run uploads in parallel using store.submit
async function uploadImage( store, session, caslib, tableName, filename, data ) {
    let parms = {
        caslib: 'casuser',
        table: 'foo',
        recLen: 1,
        vars: [
            {
                name: 'imag_55',
                type: 'BINARY',
                rType: 'CHAR',
                length: 100,
                offset: 0
            }
        ]
    };

    let  p = { action: 'table.addTable', data: parms };

    await await runAddTable(store, session, p, 'addTable');
   
}


function readFile (filename, datadir) {
    let filespath =  path.join(datadir,filename);
    let data      = fs.readFileSync(filespath);
    return data;
}



casSetup(store,payload, ['image']) 
    .then (r => {
        let data = readFile( imageName, datadir);
        let filename = imageName.split('.')[0];
       return uploadImage(store, r.session, worklib, tableName, filename, data )
    })
    .then (r => console.log('All done'))
    .catch(err => console.log(err))
