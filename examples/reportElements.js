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

let restaf     = require ('restaf');
let fs         = require('fs');
let payload = require ('./config')('restaf.env');

// Keys to the kingdom
// Create the restaf

let store = restaf.initStore();

// Get the image of the first report as a svg

async function example (store, logonPayload, reportName, outdir) {
    await store.logon(logonPayload);
    let {reports} = await store.addServices('reports');

    let p = {
        qs: {
            filter: `eq(name,'${reportName}')`
        }
    };
    console.log(reportName);
    let reportsList = await store.apiCall(reports.links('reports'), p);
    if ( reportsList.itemsList().size === 0 ) {
        console.log(`${reportName} not found`);
        process.exit(0);
    };

    let selfCmd= reportsList.itemsCmd(reportName, 'self');
    let thisreport = await store.apiCall(selfCmd);
    let visualCmd = thisreport.links('contentVisualElements');
    let visuals = await store.apiCall(visualCmd);
    console.log(visuals);
    outjs(visuals, outdir);

    return 'All Done';
}

let reportName = process.argv[ 3 ];
let outdir = process.argv[4];

example(store, payload, reportName, outdir)
   .then (status => console.log(status))
   .catch(err => console.log(err));

function outjs(visual, outdir){
    
    let visuals = visual.items().toJS();
    console.log( JSON.stringify(visuals, null,4));
    let n = visuals.length;
    let labels = visuals[0].label;
    let viNames = visuals[0].name;
  

    for ( let i = 1; i < n ; i++) { 
        let v = visuals[i];
        console.log(v);
        if ( v.hasOwnProperty('label')) {
            labels = label +  `,'${v.label}'`;
            viNames = viNames +  `,'${v.name}'`;
        }
    };
    
    let output = 'function lookupVisuals(label) { \n';

    output += `let labels = [${labels}];\n`;

    output += `let names = [${viNames}];\n`;

    output += `
      let index = labels.indexOf(label);\n
      return ( index >=0 ) ? names[index] : null;\n
      } `;
    console.log(output)  ;
}