#!/usr/bin/env node

import addapp from './addClient.js';
import delapp from './delapp.js';
import listapp from './listClient.js';

function clients (store,args,vorpal) {

    let options = {
        clientid: (args.c != null) ? args.c : null
    };
let sel = process.argv[2];
    console.log(sel);
    console.log('-----------------------------------');
    if (sel.indexOf('list') >= 0) {
        listapp();
    } else if (sel.indexOf('delete') >=0) {
        delapp();
    } else if (sel.indexOf('add') >= 0) {
        addapp();
    }  else {
        console.log(`Error: Unknown operation ${sel}`);
        process.exit(0);
    }
}
export default clients;