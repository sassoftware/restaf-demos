#!/usr/bin/env node
/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// Main entry point for MCP server

import core from "./src/core.js";
import { config } from "dotenv";
import dotenvExpand from "dotenv-expand";
import fs from "fs";

if (process.env.ENVFILE === "NONE") {
  //use this when using remote mcp server and no .env file is desired
  console.error("[Note]: Skipping .env file as ENVFILE is set to NONE...");
} else {
  let envf = "./.env";
  if (fs.existsSync(envf)) {
    console.error(`Loading environment variables from ${envf}...`);
    dotenvExpand.expand(config({ path: envf, silent: true }));
  } else {
    console.error(
      "[Note]: No .env file found, Using default environment variables..."
    );
  }
}

// need to tell core what transport to use
let mcpType = process.env.MCPTYPE || "http";
console.error(`Starting mcp-server with transport type: ${mcpType}`);

if (mcpType === "http") {
  process.env.MCPTYPE = mcpType; // ensure env variable is set
}

//  subclasses for sasQuery tool (special use case)
let subclassJson = [];
if (process.env.SUBCLASS != null) {
  console.error(`Using subclass: ${process.env.SUBCLASS}`);
  let subclass = process.env.SUBCLASS;
  if (fs.existsSync(subclass)) {
    console.error(`Loading subclass information from ${subclass}...`);
    let s = fs.readFileSync(subclass, "utf8");
    subclassJson = JSON.parse(s);
    console.error(`Loaded subclass: ${JSON.stringify(subclassJson, null, 2)}`);
  }
}
console.log(process.env.HTTPS);
console.log(process.env.SSLCERT);
const appEnv = {
  mcpType: mcpType,
  HTTPS:
    process.env.HTTPS != null && process.env.HTTPS.toUpperCase() === "TRUE"
      ? true
      : false,
  SAS_CLI_PROFILE: process.env.SAS_CLI_PROFILE || "default",
  SAS_CLI_CONFIG: process.env.SAS_CLI_CONFIG || process.env.HOME, // default to user home directory
  SSLCERT: process.env.SSLCERT || null,
  VIYASSL: process.env.VIYASSL || null,
  AUTHFLOW: process.env.AUTHFLOW || "sascli",
  VIYA_SERVER: process.env.VIYA_SERVER,
  PORT: process.env.PORT || 8080,
  USERNAME: process.env.USERNAME || null,
  PASSWORD: process.env.PASSWORD || null,
  CLIENTIDPW: process.env.CLIENTIDPW || null,
  CLIENTSECRET: process.env.CLIENTSECRETPW || null,
  TOKEN: process.env.TOKEN || null,
  TOKENFILE: process.env.TOKENFILE || null,
  TLS_CREATE: process.env.TLS_CREATE || null,
  SUBCLASS: process.env.SUBCLASS || null,
  subclassJson: subclassJson,
  // toolsets
  toolsets:
    process.env.TOOLSETS != null
      ? process.env.TOOLSETS.split(",")
      : ["default"],
  // user defined tools
  //runtime variables
  tls: null,
  transports: {},
  mcpServer: null,
  store: null,
  casServer: null,
  casSessionId: null,
  computeSessionId: null,
  logonPayload: null,
  bearerToken: null,
  tlsOpts: null,
  viyaOpts: null,
};

if (appEnv.TOKENFILE != null) {
  try {
    console.error(`Loading token from file: ${appEnv.TOKENFILE}...`);
    let t = fs.readFileSync(appEnv.TOKENFILE, { encoding: "utf8" });
    appEnv.TOKEN = t;
    appEnv.AUTHFLOW = "token";
  } catch (err) {
    console.error(`Error reading token file: ${err}`);
  }
}



console.error("MCP Server Environment: ", JSON.stringify(appEnv, null, 2));
// start the mcp server
console.error("Initializing core mcp server...");
core(appEnv)
  .then(() => {
    console.error("MCP Server initialized successfully.");
  })
  .catch((error) => {
    console.error("Error initializing MCP Server:", error);
  });
