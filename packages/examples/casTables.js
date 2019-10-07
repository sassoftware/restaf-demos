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
 * Adding a Service
 */
"use strict";

let restaf        = require("restaf");
let payload       = require('./config')();
let prtUtil       = require("./prtUtil");
let {casSetup}      = require('restaf-commons');
let printCasTable = require("./lib/printCasTable");

let store = restaf.initStore();

async function example (store, logonPayload) {
  let { apiCall } = store;

  // get root end points of casManagement
  let { servers, session } = await casSetup(store, logonPayload);

  // get list of caslibs
  let casServer = servers.itemsList(0);
  let caslibs = await apiCall(servers.itemsCmd(casServer, "caslibs"));

  prtUtil.view(caslibs, "caslibs");
  let executeCmd = session.links("execute");

  for (let i = 0; i < caslibs.itemsList().size; i++) {
    let s = caslibs.itemsList(i);
    let parms = {
      allFiles: true,
      caslib  : s
    };
    let p = {
      action: "table.fileInfo",
      data  : parms
    };
    let tables = await apiCall(executeCmd, p);
    printCasTable(tables, "FileInfo");
  }

  for (let i = 0; i < caslibs.itemsList().size; i++) {
    let s = caslibs.itemsList(i);
    let parms = {
      allFiles: true,
      caslib  : s
    };

    console.log(`-------------- ${s}`);
    let tb = caslibs.itemsCmd(s, "tables");
    console.log(JSON.stringify(tb, null, 4));
    let tables = await apiCall(tb);
    console.log(JSON.stringify(tables.itemsList(), null, 4));
    console.lo;
  }

  return true;
}

// Run the example
example(store, payload)
  .then(msg => console.log(msg))
  .catch(err => console.log(err));
