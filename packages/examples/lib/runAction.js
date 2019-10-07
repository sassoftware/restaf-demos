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
module.exports = async function(store, session, payload, title) {
    console.log( 'running action');
    let actionResult = await store.apiCall(session.links('execute'), payload);
    let statusCode = actionResult.items('disposition', 'statusCode');
    console.log( `===========================${title}`);
    console.log( JSON.stringify(actionResult.items('disposition'), null, 4));
    console.log( JSON.stringify(actionResult.items('log'), null, 4));

    console.log( JSON.stringify(actionResult.items('results'), null, 4));
    if (statusCode !== 0) {
        throw actionResult.items('disposition');
    }
    return actionResult;
}