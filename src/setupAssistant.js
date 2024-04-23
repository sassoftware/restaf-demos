/*
 * Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import OpenAI from "openai";
import { AssistantsClient, AzureKeyCredential } from "@azure/openai-assistants";

import createAssistant from "./createAssistant.js";
import setupViya from "./builtins/tools/lib/setupViya.js";
import viyaOnDemand from "./builtins/tools/lib/viyaOnDemand.js";
import createFile from "./createFile.js";

import apiMapper from "./apiMapper.js";
import builtinToolSets from "./builtins/tools/index.js";

/**
 * @async
 * @function setupAssistant
 * @description   Setup the assistant
 * @param {config} config - configuration object
 * @returns {promise} - return gptControl object}
 * @example
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
  }

  // usew user tools if passed in, else use builtin tools
  
  let useTool = config.toolSet ? config.toolSet : "viya";
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

  console.log('----------------------------------------------Toolset Summary'); 

  let summmary = toolSet.tools.map((i) => {
    if (i.type === "function") {
      return { toolName: i.function.name, description: i.function.description };
    } else {
      return { toolName: i.type };
    }
  });
  console.table(summmary);
  console.log('-------------------------------------------------------------'); 


  //moved this here to handle user override of all builtin tools

  const uploadFile =
    (gptControl) => async (filename, content, mimeType, purpose) => {
      let r = createFile(filename, content, mimeType, purpose, gptControl);
      return r;
    };
  
  let gptControl = {
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
    threadid:
      config.threadid == null || config.threadid === ""
        ? null
        : config.threadid,
    vectorStoreId:
      config.vectorStoreId == null || config.vectorStoreId === ""
        ? null
        : config.vectorStoreId,
    appEnv: null,
    client: client,
    run: null,
    assistantApi: apiMapper(client, config.provider),
    code: config.code,
    retrieval: config.retrieval,
    userData: config.userData,
    viyaOnDemand: viyaOnDemand,
    uploadFile: null
  };

  // setup Viya connections
  
  gptControl.appEnv = await setupViya(config.viyaConfig);
  gptControl.appEnv.viyaOnDemand = viyaOnDemand;
  gptControl.appEnv.userData = config.userData;
  gptControl.appEnv.user = config.user;

  // create assistant or reuse existing one
  
  gptControl.assistant = await createAssistant(gptControl);
  gptControl.uploadFile = uploadFile(gptControl);

  console.log("--------------------------------------");
  console.log("Current session:");
  console.log("Provider: ", gptControl.provider);
  console.log("Model: ", gptControl.model);
  console.log(
    "Assistant: ",
    gptControl.assistant.name,
    "Assistant id",
    gptControl.assistant.id
  );
  console.log("Threadid: ", gptControl.thread.id);
  console.log("VectorStoreId: ", gptControl.vectorStoreId);
  console.log("Using Viya:", (config.viyaConfig.logonPayload != null) ? true: false);
  console.log("--------------------------------------");
  return gptControl;
}

export default setupAssistant;
