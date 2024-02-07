#!/usr/bin/env node
/*
* Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/

import vorpal from 'vorpal';
import setupViya from '../lib/setupViya.js';
import gptPrompt from '../gptfunctions/gptPrompt.js';
import setupGpt from '../lib/setupGpt.js';

// process env variables
let apiKey = process.env.APPENV_USERKEY;
let source = process.env.VIYASOURCE;
if (['cas', 'compute'].includes(source) == false) { 
  source = 'cas';
  console.log("VIYASOURCE not set, defaulting to cas");
}

// setup openai
let gptControl = setupGpt(apiKey);

let vorpalcmd = vorpal();

// setup viya and then run the cli
setupViya(source)
  .then((appEnv) => runCli(appEnv))
  .catch((err) => {
    console.log(JSON.stringify(err));
  });

// main loop for running prompts
const runCli = (appEnv) => {
  vorpalcmd
  .mode('gpt')
  .delimiter('?')
  .init(function(args, callback){
    this.log('Welcome to gpt prompt.\nYou can enter your gpt prompts. To exit, type `exit`.');
    callback();
  })
  .action(function(command, cb) {
    var self = this;
    gptPrompt(command, gptControl, appEnv)
      .then (response => {
          vorpalcmd.log(response);
          cb();
      })
      .catch(err => {
        vorpalcmd.log(err);
      })
  });

     
    vorpalcmd
        .delimiter ('>')
        .log('--------------------------------------')
        .log('Welcome to cli for trying out gpt with Viya')
        .log('Enter gpt to start gpt session')
        .log('To exit the gpt session, type `exit`')
        .log('To exit the cli type `exit`')
        .log('')
        .log('--------------------------------------');
      
    vorpalcmd.show()
}

/*
  vorpalcmd
      .command('p <prompt...>')
      .description('Enter prompt to ask GPT-4')
      .action((args, cb)=> {
        vorpalcmd.log('prompt: ' + args.prompt);
        let p = args.prompt.join(' ');
        gptPrompt(p, gptControl, appEnv)
        .then (response => {
            vorpalcmd.log(response);
            cb();
        })
        .catch(err => {
          vorpalcmd.log(err);
        })
      })
      */