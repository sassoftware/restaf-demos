
/*
 * Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import vorpal from "vorpal";
import setupViya from "../lib/setupViya.js";
import chatgpt from "../gpt/chatgpt.js";
import setupChat from "../gpt/setupChat.js";
import setupAssist from "../gpt/setupAssist.js";
import assistance from "../gpt/assistance.js";

function main() {
  // process env variables
  let apiKey = process.env.OPENAI_KEY;
  let source = process.env.VIYASOURCE;
  if (["cas", "compute", "none"].includes(source) == false) {
    source = "cas";
    console.log("VIYASOURCE not set, defaulting to cas");
  }

  // setup openai

  // chat information
  /*
  let gptControl = setupChat(apiKey);
  let orignalMessages = [].concat(gptControl.createArgs.messages);
  */
  let gptControl = {};

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
      .init(function (args, cb) {
        this.log("Enter prompts ");
        this.log("To exit chat mode,  enter exit.");
        this.log("To see descriptions of the available functions enter `help`");
        gptControl = setupChat(apiKey);
        cb();
      })
      .action(function (command, cb) {
        // var self = this; -- just as a reminder that this is available
        chatgpt(command, gptControl, appEnv)
          .then((response) => {
            if (response === "clear") {
              gptControl.createArgs.messages = [].gptControl.originalMessages;
            }
            if (response === "history") {
              response = gptControl.createArgs.messages;
            }
            vorpalcmd.log(JSON.stringify(response, null,4));
            cb();
          })
          .catch((err) => {
            vorpalcmd.log(err);
          });
      });
      vorpalcmd
      .mode("assist", "Enter chat with openai assistant")
      .delimiter("?")
      .init(function (args, cb) {
        this.log("Enter prompts ");
        this.log("To exit chat mode,  enter exit.");
        this.log("To see descriptions of the available functions enter `help`");
        setupAssist(apiKey)
        .then ((control) => {
          gptControl = control;
          cb();
        })
      })
      .action(function (command, cb) {
        // var self = this; -- just as a reminder that this is available
        assistance(command, gptControl, appEnv)
          .then((response) => {
            vorpalcmd.log(response);
            cb();
          })
          .catch((err) => {
            vorpalcmd.log(err);
          });
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
      .log("Enter `assistant` to chat with openai assistant")
      .log("Enter `azure` to chat with azureAI")
      .log("Enter `help` to see other chat options")
      .log("To exit the cli type `exit` or ^C")
      .log("")
      .log("--------------------------------------")
    
    
    vorpalcmd.show();
  };
}
export default main;