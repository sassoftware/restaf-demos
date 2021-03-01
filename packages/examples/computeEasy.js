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

// running a  compute job

"use strict";

let restaf    = require("@sassoftware/restaf");
let restaflib = require("@sassoftware/restaflib");
let payload = require('./config')();

let store = restaf.initStore();

async function example (store, logonPayload) {
  let { computeSetup, computeRun } = restaflib;
  let msg = await store.logon(logonPayload);
  let computeContext = null; /* defaults to Job Execution Compute context */
  debugger;
  let computeSession = await computeSetup(store, computeContext);
  
  let macros = {rows: 100};
  let code = `data _null_; do i = 1 to &rows; x=1; end; run; `;

  let computeSummary = await computeRun(
      store,
      computeSession,
      code,
      macros,
      15,2  /*just a place holder values for checking job status */
  );
  
  let log = await restaflib.computeResults(store, computeSummary, 'log');
  viewer(log);
  await store.apiCall(computeSession.links('delete'));
  return "All Done";
}

function viewer (dataL) {
  dataL.map(data => {
    let line = data["line"].replace(/(\r\n|\n|\r)/gm, "");
    if (line.length === 0) {
      line = "  ";
    }
    console.log(line);
  });
}

// Run the example
example(store, payload)
  .then(status => console.log(status))
  .catch(err => console.log(JSON.stringify(err, null,4)));
