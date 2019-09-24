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

module.exports = function parseEvent (event) {

    let body = {};
    let _appEnv_ = {
        model: {
           caslib: process.env.MODEL_CASLIB,
           name  : process.env.MODEL_NAME
        },
        table: {
            caslib: process.env.TABLE_CASLIB,
            name  : process.env.TABLE_NAME
        }
    }
    console.log(event.body);

    if (event.body != null) {
        body = (typeof event.body === 'string')
            ? JSON.parse(event.body)
            : Object.assign({}, event.body);
        _appEnv_ = {..._appEnv_, ...body}  ;
    }

    // console.log(_appEnv_);
    return _appEnv_;

}