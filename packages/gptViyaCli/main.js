
/*
 * Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import vorpal from "vorpal";
import setupViya from "../lib/setupViya.js";
import gptPrompt from "../gpt/gptPrompt.js";
import setupGpt from "../gpt/setupGpt.js";

function main() {
  // process env variables
  let apiKey = process.env.OPENAI_KEY;
  let source = process.env.VIYASOURCE;
  if (["cas", "compute", "none"].includes(source) == false) {
    source = "cas";
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
      .mode("gpt")
      .delimiter("?")
      .init(function (args, callback) {
        this.log("Enter prompts to be processed by gpt");
        this.log("To exit gpt mode,  enter exit.");
        this.log("To see descriptions of the available funtions enter `help`");
        callback();
      })
      .action(function (command, cb) {
        // var self = this; -- just as a reminder that this is available
        gptPrompt(command, gptControl, appEnv)
          .then((response) => {
            vorpalcmd.log(response);
            cb();
          })
          .catch((err) => {
            vorpalcmd.log(err);
          });
      });
    
    vorpalcmd
      .delimiter(">")
      .log("--------------------------------------")
      .log("Welcome to cli for trying out gpt with Viya")
      .log("Enter gpt to start gpt session")
      .log("To exit the gpt session, type `exit`")
      .log("To exit the cli type `exit`")
      .log("")
      .log("--------------------------------------")
    
    
    vorpalcmd.show();
  };
}
export default main;