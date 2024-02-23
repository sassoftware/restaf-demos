
/*
 * Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import vorpal from "vorpal";
import setupViya from "../lib/setupViya.js";
import chatgpt from "../gpt/chatgpt.js";
import setupChat from "../gpt/setupChat.js";
import setupAssist from "../gpt/setupAssist.js";
import assistant from "../gpt/assistant.js";
import functionSpecs from "../gptFunctions/functionSpecs.js";

const instructions = `
 You are an assistant designed to help users to using SAS Viya.
 The users will ask questions pertaining to SAS artifacts like library, tables, reports, models, etc.
 The might want to get a list of these artifacts(ex: list tables in a library, list of reports)
 The will also fetch data and reports from Viya. When you cannot answer a question, you will ask for help

 If they want to add file to the assistant they will use the command 'add file' and then the file name.

 The user might also want to get a list of the threads that are available to them. They might want to delete the thread.
`;
function main() {
  let source = process.env.VIYASOURCE;
  if (["cas", "compute", "none"].includes(source) == false) {
    source = "cas";
    console.log("VIYASOURCE not set, defaulting to cas");
  }

  let gptControl = {};
  let specs = functionSpecs();

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
      .mode("chatgpt", "Enter chat")
      .alias("chat")
      .delimiter("?")
      .init(function (args, cb) {
        this.log("Enter prompts ");
        this.log("To exit chat mode,  enter exit.");
        this.log("To see descriptions of the available functions enter `help`");
        gptControl = setupChat();
        cb();
      })
      .action(function (command, cb) {
        // var self = this; -- just as a reminder that this is available
        chatgpt(command, gptControl, appEnv)
          .then((response) => {
            if (response === "clear") {
              gptControl.createArgs.messages = [].concat(gptControl.originalMessages);
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
      .mode("assistant [name]", "Enter chat with openai assistant")
      .alias("assist")
      .option('-t --thread', 'If specified a new thread will be created, otherwise the last thread will be reused')
      .delimiter("?")
      .init(function (args, cb) {
        this.log("Enter prompts ");
        this.log("To exit chat mode,  enter exit.");
        let name = (args.name == null || args.name.trim().length === 0 ) ? "SAS_Assistant" : args.name;
        console.log(args);
        let threadReuse = !args.options.thread ? false : args.options.thread;
        this.log("To see descriptions of the available functions enter `help`");
        setupAssist('openai', name, threadReuse, specs, instructions )
        .then ((control) => {
          gptControl = control;
          cb();
        })
      })
      .action(function (command, cb) {
        // var self = this; -- just as a reminder that this is available
        assistant(command, gptControl, appEnv)
          .then((response) => {
            vorpalcmd.log(response);
            cb();
          })
          .catch((err) => {
            vorpalcmd.log(err);
          });
      });
    
      vorpalcmd
      .mode("azure [name]", "Enter chat with assistant with Azure AI")
      .alias("az")
      .option('-t --thread', 'If specified a new thread will be created, otherwise the last thread will be reused')
      .delimiter("?")
      .init(function (args, cb) {
        this.log("Enter prompts ");
        this.log("To exit chat mode,  enter exit.");
        let name = (args.name == null || args.name.trim().length === 0 ) ? "SAS_Assistant" : args.name;
        let threadReuse = !args.options.thread ? false : args.options.thread;
        this.log("To see descriptions of the available functions enter `help`");
        setupAssist('azure', name, threadReuse, specs, instructions )
        .then ((control) => {
          gptControl = control;
          cb();
        })
      })
      .action(function (command, cb) {
        // var self = this; -- just as a reminder that this is available
        assistant(command, gptControl, appEnv)
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