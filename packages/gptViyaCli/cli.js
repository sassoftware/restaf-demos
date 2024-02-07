
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

const runCli = (appEnv) => {


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
    vorpalcmd
        .delimiter ('>')
        .log('--------------------------------------')
        .log('Welcome to cli for trying out gpt with Viya')
        .log('Enter help to get a list of all the commands')
        .log('');

    vorpalcmd.show();
}