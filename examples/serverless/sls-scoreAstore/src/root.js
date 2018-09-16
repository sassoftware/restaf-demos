'use strict';
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
let setPayload = require('../lib/setPayload');
module.exports.root = async function (event, context) { 

      let links = [
            {
                  method: 'GET',
                  href  : '/test',
                  rel   : 'test',
                  uri   : '/test',
                  type  : 'application/json'
            },
            {
                  method      : 'POST',
                  href        : '/score',
                  rel         : 'score',
                  uri         : '/score',
                  responseType: 'application/json',
                  type        : 'application/json'
            },
            {
                  method      : 'POST',
                  href        : '/describe',
                  rel         : 'describe',
                  uri         : '/describe',
                  responseType: 'application/json',
                  type        : 'application/json'
            },

      ];
      let body = {
         links: links
      };
     return setPayload(body);
}