#!/usr/bin/env node
/*
* Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/


import restaf from '@sassoftware/restaf';
import vorpalImport from 'vorpal';
const vorpal = vorpalImport();
import fss from 'fs';
const fs = fss.promises;
import config from './src/config.js';
import logon from './src/logon.js';
import addClient from './src/addClient.js';
import delClient from './src/delClient.js';
import listClient from './src/listClient.js';
import detailClient from './src/detailClient.js';
import runCmds from './src/runCmds.js';
//import yargs from 'yargs';
let argv = {};
;

let cmdFile = null;;
let ttl = null;
let clientConfigFile = null; 
let clientConfig = null;

if (clientConfigFile !== null ) {
    let draw = fss.readFileSync(clientConfigFile, 'utf8');
    clientConfig = JSON.parse(draw);
    console.log(clientConfig);

}

async function start() {
    let logonPayload = await config();
    console.log(logonPayload);
    let store  = restaf.initStore();
    await store.logon(logonPayload);
    console.log(store.connection());
    return { store, logonPayload };
    }

start()
    .then(({ store, logonPayload }) => {
        runCli(store, cmdFile)
    })
    .catch(err => {
        console.error('Error during setup:', err);
        process.exit(1);
    });
function runCli (store, cmdFile) {
   
    vorpal
        .command('logon')
        .description('Logon to Viya')
        .action((args, cb)=> {
           logon(store, logonPayload, vorpal)
            .then (r => { 
                vorpal.log('Logon Successful');
                cb();
            }) 
            .catch (err => {
                vorpal.log(err);
                cb();
            })
        }); 
    
    vorpal
        .command('list [all]')
            .description('List clients. Use all option to include system clientids')
            .action ((args,cb) => {
                listClient(store, args.all, vorpal)
                .then(r => { vorpal.log(r); vorpal.log(r); cb();})
                .catch(e => { vorpal.log(e); cb();});
            });
    vorpal
        .command('config <config>')
            .description('File containing the configuration for clientid registeration')
            .action ((args,cb) => {
                fs.readFile(args.config, 'UTF8')
                 .then (dataraw => {
                    clientConfig = JSON.parse(dataraw);
                    vorpal.log(`Clientid config set to:`);
                    vorpal.log(JSON.stringify(clientConfig, null,4));
                    cb();
                 })
                 .catch(err => {
                     vorpal.log(err);
                     cb();
                 });
            });
    vorpal
        .command('new <clientid>')
            .alias('add')
            .description('Add a new client with specified name')
            .option('-t --type [type]', 'Grant Type')
            .option('-r --redirect [redirect]', 'Redirect uri')
            .option('-s --secret [secret]', 'Secret')
            .option('-f --file [configFile]', 'Config file')

            .action ((args, cb) => {
               addClient(store, args.clientid, args.options, clientConfig, ttl)
               .then(r => { vorpal.log(r); cb();})
               .catch(e => { vorpal.log(e); cb();});
            });
    vorpal
        .command('clientid <configFile>')
            .alias('id')
            .description('Add a new client with specified config File')
            .action ((args, cb) => {
                console.log(args);
                debugger;
                let clientConfig = fss.readFileSync(args.configFile, 'utf8');
                console.log(clientConfig);
                let tjson = JSON.parse(clientConfig);
                addClient(store, ' ', args.options, tjson, ttl)
                .then(r => { vorpal.log(r); cb();})
                .catch(e => { vorpal.log(e); cb();});
            });
    vorpal
        .command('delete <clientid>')
            .alias('del')
            .description('Delete specified client')
            .action ((args,cb) => {
                delClient(store, args.clientid)
                .then(r => { vorpal.log(r); cb();})
                .catch(e => { vorpal.log(e); cb();});
            });
     vorpal
            .command('details <clientid>')
            .alias('desc')
            .alias('show')
            .description('Details of selected clienti')
            .action((args, cb) => {
                detailClient(store, args.clientid)
                    .then((r) => {
                        vorpal.log(r);
                        cb();
                    })
                    .catch((e) => {
                        vorpal.log(e);
                        cb();
                    });
            });
    vorpal
        .command('token <file>')
        .description('save current oauth token to specified file')
        .action((args, cb) => {
            let token = store.connection().token;
            fs.writeFile(args.file, token)
                .then(r => {
                    vorpal.log(`token written to ${args.file}`);
                    cb();
                })
                .catch(e => {
                    vorpal.log(e);
                    cb();
                });
        });


    vorpal
        .delimiter ('>> ')
        .log('--------------------------------------')
        .log('Welcome to @sassoftware/registerclient to manage clientids')
        .log('Enter help to get a list of all the commands')
        .log('');

    if (cmdFile === null) {
        vorpal.show();
    } else {
        logon(store, logonPayload)
            .then (() => runCmds(store, cmdFile, vorpal))
            .then (r  => console.log(r))
            .catch(err => {
                vorpal.log(err);
        });    
    }
}