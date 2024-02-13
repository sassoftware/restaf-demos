
/*
 * Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import vorpal from "vorpal";
import setupViya from "../lib/setupViya.js";
import chatgpt from "../gpt/chatgpt.js";
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
  let orignalMessages = [].concat(gptControl.createArgs.messages);
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
      .mode("chat", "Enter chat with openai")
      .delimiter("?")
      .init(function (args, callback) {
        this.log("Enter prompts ");
        this.log("To exit chat mode,  enter exit.");
        this.log("To see descriptions of the available funtions enter `help`");
        gptControl.createArgs.messages = [].concat(orignalMessages);
        callback();
      })
      .action(function (command, cb) {
        // var self = this; -- just as a reminder that this is available
        chatgpt(command, gptControl, appEnv)
          .then((response) => {
            if (response === "clear") {
              gptControl.createArgs.messages = [].concat(orignalMessages);
            }
            if (response === "history") {
              response = gptControl.createArgs.messages;
            }
            vorpalcmd.log(response);
            cb();
          })
          .catch((err) => {
            vorpalcmd.log(err);
          });
      });
      vorpalcmd
      .command("assistant", "Use openai assistant for chat")
      .alias("assist")
      .action(function (args, cb) {
        vorpalcmd.log("assistant is coming soon");
        cb()
      });
      vorpalcmd
      .command("azure", "Use azureAI for chat")
      .alias("az")
      .action(function (args, cb) {
        vorpalcmd.log("azureai is coming soon");
        cb()
      });

      
    vorpalcmd
      .delimiter(">")
      .log("--------------------------------------")
      .log("Welcome to cli for trying out chatgpt with Viya")
      .log("Enter chat to chat with openai")
      .log("Enter `help` to see other chat options")
      .log("To exit the cli type `exit` or ^C")
      .log("")
      .log("--------------------------------------")
    
    
    vorpalcmd.show();
  };
}
export default main;