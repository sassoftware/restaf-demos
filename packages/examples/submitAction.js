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
let restaflib  = require("@sassoftware/restaflib");
let payload = require('./config')();
let prtUtil = require("./prtUtil");

let store = restaf.initStore();

async function example (store, logonPayload) {
  // logon;
  //noinspection JSUnusedLocalSymbols
  let msg = await store.logon(logonPayload);

  let {session} = await restaflib.casSetup(store);

  // Now run a simple data step in that session
  let p = {
    action: 'datastep.runCode',
    data  : {
      code: 'data casuser.score; do j = 1 to 5;do i = 1 to 1000000000; x1=10;x2=20;x3=30; score1 = x1+x2+x3;end; end; run; '
    }
  };
  
  const progress = (status, jobContext) => {
    console.log('progress ', status);
    return false;
  }

  const onCompletion = (context, r) => {
    console.log('***', JSON.stringify(r.items()));
  }
  // session, payload,context, onCompletion, maxTries,delay, progress
  debugger;
  console.log(p);
  
   let r = await store.runAction(session, p,'AAA', onCompletion /*,'wait',1,progress*/);
//  let r = await store.runAction(session,p);
   
   console.log(JSON.stringify(r.items(), null,4));
   await store.apiCall(session.links('delete'));
   return "returning to main";
}

// Run the example
example(store, payload)
  .then(r => console.log(r))
  .catch(err => prtUtil.printErr(err));
