/*
 * Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import OpenAI from "openai";
import { AssistantsClient, AzureKeyCredential } from "@azure/openai-assistants";

import createAssistant from "./createAssistant.js";
import setupViya from "./builtins/tools/lib/setupViya.js";
import getViyaSession from "./builtins/tools/lib/getViyaSession.js";
import createFile from "./createFile.js";

import apiMapper from "./apiMapper.js";
import builtinToolSets from "./builtins/tools/index.js";
// import { setLogLevel } from "@azure/logger";



/**
 * @async
 * @function setupAssistant
 * @description   Setup the assistant
 * @param {config} config - configuration object
 * @returns {promise} - return appControl object}
 *
 */

async function setupAssistant(config) {
  let { credentials } = config;
  let { key, endPoint } = credentials;
  // create the client

  let client = null;
  if (config.provider === "openai") {
    client = new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true });
  } else {
    client = new AssistantsClient(endPoint, new AzureKeyCredential(key, {}));
   // setLogLevel("info");
  }

  // usew user tools if passed in, else use builtin tools
  
  let useTool = config.toolSet ? config.toolSet : "sasic";
  let toolSet = {};
  if (config.domainTools.tools.length > 0) {
    toolSet = config.domainTools;
    console.log("Using user supplied tool");
  } else {
    let specs = builtinToolSets[useTool].tools;
    toolSet = {
      tools: specs,
      functionList: builtinToolSets[useTool].functionList,
      instructions: builtinToolSets[useTool].instructions,
    };
  }

  if (config.code) {
    toolSet.tools.push({ type: "code_interpreter" });
  }
  if (config.retrieval) {
    toolSet.tools.push({ type: "file_search" });
  } 

   

  let summmary = toolSet.tools.map((i) => {
    if (i.type === "function") {
      let s = i.function.description.substring(0,72) + '...';
      return { toolName: i.function.name, description: i.function.description };
    } else {
      return { toolName: i.type };
    }
  });
  
  

  //helper functions

  const uploadFile =
    (appControl) => async (filename, content, mimeType, purpose) => {
      let r = createFile(filename, content, mimeType, purpose, appControl);
      return r;
    };
  const getViyaSessionf =
  (appControl) => async (source) => {
    let r = getViyaSession(appControl, source);
    return r;
  };
  
  let appControl = {
    provider: config.provider,
    model: config.model,
    domainTools: toolSet,
    instructions: toolSet.instructions,
    temperature: config.temperature ? config.temperature : 0.5,
    devMode: config.devMode,
    assistantName: config.assistantName,
    assistantid:
      config.assistantid == null || config.assistantid === ""
        ? null
        : config.assistantid,
    assistant: null,
    thread: null,
    vectorStore: null,
    threadid:
      config.threadid == null || config.threadid === ""
        ? null
        : config.threadid,
    vectorStoreid:
      config.vectorStoreid == null || config.vectorStoreid === ""
        ? null
        : config.vectorStoreid,
    appEnv: null,
    client: client,
    run: null,
    assistantApi: apiMapper(client, config.provider),
    logLevel: config.logLevel,
    pollStatus: config.pollStatus,
    pollInterval: (!config.pollInterval) ? 5000 : config.pollInterval,
    code: config.code,
    retrieval: config.retrieval,
    userData: config.userData,
    getViyaSession: null,
    uploadFile: null
  };

  // setup Viya connections
  appControl.appEnv = await setupViya(config.viyaConfig);
  
  appControl.appEnv.userData = config.userData;
  appControl.appEnv.user = config.user;

  // create assistant or reuse existing one
  try {
    appControl.assistant = await createAssistant(appControl);
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to create assistant ${error}`);
  }
  // two helper functions
  appControl.uploadFile = uploadFile(appControl);
  appControl.getViyaSession = getViyaSessionf(appControl);

  console.log("--------------------------------------");
  console.log("Current session:");
  console.log("devMode: ", appControl.devMode);
  console.log("Provider: ", appControl.provider);
  console.log("Model: ", appControl.model);
  console.log("Assistant Name: ",appControl.assistant.name);
  console.log("Assistantid", appControl.assistant.id);
  console.log("Threadid: ", appControl.thread.id);
  console.log("VectorStoreId: ", appControl.vectorStoreid);
  console.log("Using Viya:", (config.viyaConfig.logonPayload != null) ? true: false);
  console.log("Tools: ", summmary);
  console.log("--------------------------------------");
  return appControl;
}

export default setupAssistant;
