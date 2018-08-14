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
let runAction   = require('../lib/runAction');
let scoreAsJson = require('../lib/scoreAsJson');
let parseEvent  = require('../lib/parseEvent');


module.exports = async function descMain(store, event, context) {
    

    let {rstore} = parseEvent(event);

    let parms = {
       rstore: { caslib: rstore.caslib, name: rstore.name}
    };
  
    // get description
    let payload = { 
        action: 'aStore.describe', 
        data: parms 
        };

    let {session} = await casSetup(store, ['sccasl']);
    let result    = await runAction(store, session, payload, 'describe');
    return {columns: scoreAsJson(result, 'InputVariables')};
}

