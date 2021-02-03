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
           action datastep.runcode/ single='YES' code = 'data casuser.a; x=1; run;';
           action table.fetch r=r1/
              table= { caslib= 'casuser', name= 'a' } ;
              run;
              action datastep.runcode/ single='YES' code = 'data casuser.b; y=1; run;';
            action table.fetch r=r2/
              table= { caslib= 'casuser', name= 'b' } ;
              run;
           c = {a=10, b=20};
           send_response({a=r1, b=r2, c=c});
        `;

  let p = {
    action: "sccasl.runcasl",
    data  : { code: casl }
  };

  const progress = (status, jobContext) => {
    console.log('progress ', status);
    debugger;
    return (status.items.isIdle === false);
  }
  const onCompletion = (context, r) => {
    debugger;
    console.log('***', JSON.stringify(r.items()));
  }
  debugger;
  let r = await restaflib.caslRun(store, session, casl, null, true, 'AAA',onCompletion, 'wait',5,progress);
  debugger;

  console.log(JSON.stringify(r));

  return "done";
}

example()
  .then(r => console.log(r))
  .catch(err => console.log(err));
