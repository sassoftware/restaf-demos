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

module.exports = function parseEvent(event){
    
    debugger;
    let input = null;
    let body = {};
    let rstore = {
        caslib:  process.env.ASTORE_CASLIB,
        name  : process.env.ASTORE_NAME
    }

    //temp

    if ( event.body == null ) {
        body = {};
    } else { 
        if ( typeof event.body === 'string') {
            body = JSON.parse(event.body);
        } else {
            body = Object.assign({}, event.body);
        }
    }
  
    if ( body.hasOwnProperty('input') === true ) {
        input = body.input;
    }

    if ( body.hasOwnProperty('astore') === true){
        rstore = body.astore;
    }

    return { rstore: rstore, input: input }

}