

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
let casSetup = require('../lib/casSetup');

let runAction = require('../lib/runAction');

let payload = require('./config')('restaf.env') ;
let datadir  = './data/astore';
let worklib  = 'casuser';


let store = restaf.initStore();

//TBD: run uploads in parallel using store.submit
async function uploadFiles( store, session, caslib, datadir ) {
    let files = readdir(datadir);

    for (let i = 0 ; i < files.length ;i++) {
    
        let parms = { caslib: caslib, name: files[i],  quiet : true};
        await runAction(store, session, {action: 'table.dropTable', data: parms}, 'Drop Tables')

        parms = { caslib: caslib, source: files[i],quiet : true};
        await runAction(store, session, {action: 'table.deleteSource', data: parms}, 'delete Sources')

        parms = {
            rstore: { name: files[i], caslib: caslib, replace: true},
            store : readFile(files[i], datadir)
        };
        payload = { action: 'aStore.upload', data: parms };
        console.log( `uploading  ${files[i]}`);
        await await runAction(store, session, payload, 'upload');
        
        parms = { rstore: { name: files[i], caslib: caslib } };
        payload = { action: 'aStore.describe', data: parms };
        await await runAction(store, session, payload, 'describe');
       
        parms = {
            caslib : caslib,
            name   : files[i],
            replace: true,
            table: {
                caslib: caslib,
                name  : files[i]
            }
        };
        payload ={action: 'table.save', data: parms};
        await await runAction(store, session, payload, 'save');
    }
}


function readFile (filename, datadir) {
    let filespath =  path.join(datadir,filename);
    let data      = fs.readFileSync(filespath);
    return Buffer.from(data).toString('base64');
}

function readdir( dir ) {
    let fulldir = path.resolve(dir);
    let files   = fs.readdirSync( fulldir);
    return files;
}


casSetup(store,payload, ['astore']) 
.then (r => uploadFiles(store, r.session, worklib, datadir))
.then (r => console.log('All done'))
.catch(err => console.log(err))
