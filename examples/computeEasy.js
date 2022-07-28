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
  
  let macros = {data: 'sashelp.cars'};
  let code = `ods html style=barrettsblue;  
  data dtemp1;
  set sashelp.cars;
  run;
  data dtemp2;
  do i = 1 to 1000000;
    output;
  end;
  run;
  proc print data=&data;run;
  ods html close;`
  ;
  console.log(Date());
  let computeSummary = await computeRun(
      store,
      computeSession,
      code,
      macros,
      10,
  );
  console.log(Date());
  let log = await restaflib.computeResults(store, computeSummary, 'log');
  let ods = await restaflib.computeResults(store, computeSummary, 'ods');
  console.log(Date());
  viewer(log);
  // console.log(ods);
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
