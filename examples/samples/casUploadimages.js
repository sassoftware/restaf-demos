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

 //
 // Place holder for some research into changing the way images are loaded.
 //
 // This code does not work at this time
 
 'use strict';

let restaf   = require('restaf');
let fs       = require('fs');
let path     = require('path');

let payload = require('./config')('restaf.env');
let datadir  = './data/images';
let buftype  = 'binary';

let store = restaf.initStore();

//TBD: run uploads in parallel using store.submit
async function uploadFiles( store, payload, datadir ) {
    await store.logon(payload);
    let {files} = await store.addServices('files');

    let filesList = readdir(datadir);
    let nfiles = filesList.length;

    for ( let i = 0; i < nfiles ; i++ ) {
        let data = readFile(filesList[i], datadir, buftype);
        let headers = {
            'Content-Disposition': `form-data; name="${filesList[i]}" filename="images_${filesList[i]}"`,
            'Content-Type'       : 'image/jpeg'
        }

        let payload = {
            headers: headers,
            data   : data
        };

        let r = await store.apiCall( files.links('create'), payload);
        console.log( r.status);

    }

}


function readFile (filename, datadir, buftype) {
    let filespath =  path.join(datadir,filename);
    let data      = fs.readFileSync(filespath);
    if ( buftype === 'base64' ) {
        return Buffer.from(data).toString('base64');
    } else {
        return data;
    }
}

function readdir( dir ) {
    let fulldir = path.resolve(dir);
    let files   = fs.readdirSync( fulldir);
    return files;
}



uploadFiles(store, payload, datadir)
    .then (r => console.log('All done'))
    .catch(err => console.log(err))
