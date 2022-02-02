"use strict";

let restaf = require("@sassoftware/restaf");
const restaflib = require("@sassoftware/restaflib");
let payload = require('./config')();
let {casSetup} = require('@sassoftware/restaflib');

let prtUtil = require("./prtUtil");

let store = restaf.initStore();
async function example () {
  let { session } = await casSetup (store, payload);
  // console.log(JSON.stringify(session.links(), null, 4));
 let casl = `

           action datastep.runcode/ 
           code= 'data casuser.score; do j= 1 to 5;do i = 1 to 1000000000; x1=10;x2=20;x3=30; score1 = x1+x2+x3;end;end; run; ';
           action datastep.runcode/ 
           code= 'data casuser.score; do i = 1 to 1000000000; x1=10;x2=20;x3=30; score1 = x1+x2+x3;end; run; ';
             send_response({status= 'done'});
            `;

  let p = {
    action: "sccasl.runcasl",
    data  : { code: casl }
  };

  const progress = (status, jobContext) => {
    console.log('progress ', status);
    debugger;
    return false;
  }
  const onCompletion = (context, r) => {
    debugger;
    console.log('***', JSON.stringify(r.items()));
  }
  debugger;
  let r = await restaflib.caslRun(store, session, casl, null, true, 'AAA',onCompletion, 'wait',5,progress);
  debugger;

  console.log(JSON.stringify(r, null,4));

  return "done";
}

example()
  .then(r => console.log(r))
  .catch(err => console.log(err));
