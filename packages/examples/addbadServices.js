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

"use strict";

let restaf  = require("@sassoftware/restaf");
let payload = require('./config')();

let store = restaf.initStore();
let prtUtil = require("./prtUtil");

/* --------------------------------------------------------------------------------
 * Logon to the restaf server and setup file service
 * ---------------------------------------------------------------------------------
 */

async function setup (payload, ...args) {
  let msg = await store.logon(payload);
  prtUtil.print(`Logon status: ${msg}`);
  let restafLinks = await store.addServices(...args);
  prtUtil.print(store.getServices(), "Current Service Folders");

  return true;
}

setup(payload, "modelPublishing")
  .then(r => console.log(r))
  .catch(e => console.log(JSON.stringify(e, null, 4)));
