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
 * Simple echo action example
 */
'use strict';
let casSetup    = require('../lib/casSetup');

let scoreAsJson = require('../lib/scoreAsJson');
let parseEvent  = require('../lib/parseEvent'); 

 module.exports = async function sentimentMain (store, event, context) {

    let document = parseEvent(event);
    if ( document === null ) {
        throw {Error: 'Missing document' }
    }

    let documentx = document.replace(/"/g, '""');
    documentx = documentx.replace(/'/g, "''");

    let {session} = await casSetup(store, ['sccasl']);
    let caslStatements = `
        loadactionset "sentimentAnalysis";
        loadactionset "datastep";
        action datastep.runCode /
           single="YES"
           code = 'data casuser.text;docid="text"; text="${documentx}";run;';

        action sentimentAnalysis.applySent /
          casout = { caslib='casuser' name='sentiments' replace=TRUE}
          table  = { caslib= 'casuser' name= 'text'}
          text   = 'text'
          docId  = 'docId';



        action table.fetch r=result/
           format = TRUE
           table = {caslib="casuser" name="sentiments"};
        send_response( result );
    `;
    debugger; 
    let payload = {
        action: 'sccasl.runcasl',
        data  : { code: caslStatements}
    }
    let result = await store.runAction(store, session, payload, 'score');
    let score = scoreAsJson(result, 'Fetch');
    return {score: score[0]};
}
