#!/usr/bin/env node
/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// Main entry point for MCP server


import coreSSE from './src/coreSSE.js'; 
import corehttp from './src/corehttp.js';
import createMcpServer from './src/createMcpServer.js';
import { config } from 'dotenv';
// import dotenvExpand from 'dotenv-expand';
import fs from 'fs';
import { randomUUID } from 'node:crypto';

import refreshToken from './src/toolhelpers/refreshToken.js'; 
import getLogonPayload from './src/toolhelpers/getLogonPayload.js';
import getOptsViya from './src/toolhelpers/getOptsViya.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import NodeCache from 'node-cache';

const __dirname = dirname(fileURLToPath(import.meta.url));

// session sessionCache
// For more robust caching consider products like Redis
// and storage provided by cloud providers

debugger;
let sessionCache = new NodeCache({ stdTTL: 0, checkperiod: 2*60, useClones: false });
//
// Load environment variables from .env file if present
if (process.env.ENVFILE === 'NONE') {
  //use this when using remote mcp server and no .env file is desired
  console.error('[Note]: Skipping .env file as ENVFILE is set to NONE...');
} else {
  let envf = __dirname + '\\.env';
  console.error(envf);
  if (fs.existsSync(envf)) {
    console.error(`Loading environment variables from ${envf}...`);
    let e = config({ path: envf, silent: true });
    console.error('[Note]: Environment variables loaded from .env file...');
   // dotenvExpand.expand(e);
  } else {
    console.error(
      '[Note]: No .env file found, Using default environment variables...'
    );
  }
}

debugger;
// need to tell core what transport to use(http or stdio)
let mcpType = process.env.MCPTYPE || 'http';
console.error(`Starting mcp-server with transport type: ${mcpType}`);

//TBD: This might not be necessary. Verify and remove if so.
if (mcpType === 'http') {
  process.env.MCPTYPE = mcpType; // ensure env variable is set
}

//  subclasses for sasQuery tool (special use case)
// to be replaced by the planned adding external tool definition capability

let subclassJson = [];
if (process.env.SUBCLASS != null) {
  console.error(`Using subclass: ${process.env.SUBCLASS}`);
  let subclass = process.env.SUBCLASS;
  if (fs.existsSync(subclass)) {
    console.error(`Loading subclass information from ${subclass}...`);
    let s = fs.readFileSync(subclass, 'utf8');
    subclassJson = JSON.parse(s);
    console.error(`Loaded subclass: ${JSON.stringify(subclassJson, null, 2)}`);
  }
}
// setup base appEnv 
// for stdio this is the _appContext
// for http each session a copy of this as appEnvTemplate is created in corehttp
const appEnvBase= {
  mcpType: mcpType,
  HTTPS:
    process.env.HTTPS != null && process.env.HTTPS.toUpperCase() === 'TRUE'
      ? true
      : false,
  SAS_CLI_PROFILE: process.env.SAS_CLI_PROFILE || 'default',
  SAS_CLI_CONFIG: process.env.SAS_CLI_CONFIG || process.env.HOME, // default to user home directory
  SSLCERT: process.env.SSLCERT || null,
  VIYASSL: process.env.VIYASSL || null,
  DEFAULT_CAS_SERVER: process.env.DEFAULT_CAS_SERVER || null,
  AUTHFLOW: process.env.AUTHFLOW || 'sascli',
  VIYA_SERVER: process.env.VIYA_SERVER,
  PORT: process.env.PORT || 8080,
  USERNAME: process.env.USERNAME || null,
  PASSWORD: process.env.PASSWORD || null,
  CLIENTIDPW: process.env.CLIENTIDPW || null,
  CLIENTSECRET: process.env.CLIENTSECRETPW || null,
  TOKEN: process.env.TOKEN || null,
  REFRESH_TOKEN: process.env.REFRESH_TOKEN || null,
  TOKENFILE: process.env.TOKENFILE || null,
  TLS_CREATE: process.env.TLS_CREATE || null,
  SUBCLASS: process.env.SUBCLASS || null,
  subclassJson: subclassJson,
  // toolsets
  toolsets:
    process.env.TOOLSETS != null
      ? process.env.TOOLSETS.split(',')
      : ['default'],
  // user defined tools
  //runtime variables
  tokenRefresh: process.env.TOKENREFRESH ==='FALSE' ? false : true,
  tls: null,
  refreshToken: null,
  transports: {},
  mcpServer: null,
  viyaSessions: {},
  store: null,
  casServer: null,
  casSessionId: null,
  computeSessionId: null,
  logonPayload: null,
  bearerToken: null,
  tlsOpts: null,
  viyaSSL: null,
  viyaOpts: null,
  contexts: {
    sas: (process.env.COMPUTECONTEXT == null) ? 'SAS Job Execution compute context' : process.env.COMPUTECONTEXT,
    cas: (process.env.CASSERVER == null) ? 'cas-shared-default' : process.env.CASSERVER
  }
};

// setup TLS options for viya calls

appEnvBase.viyaSSL = appEnvBase.VIYASSL;
console.error('Viya SSL dir set to: ' + appEnvBase.viyaSSL);
appEnvBase.viyaOpts = await getOptsViya(appEnvBase); 

if (appEnvBase.TOKENFILE != null) {
  try {
    console.error(`Loading token from file: ${appEnvBase.TOKENFILE}...`);
    let t = fs.readFileSync(appEnvBase.TOKENFILE, { encoding: 'utf8' });
    appEnvBase.TOKEN = t;
    appEnvBase.AUTHFLOW = 'token';
    appEnvBase.logonPayload = {
      host: appEnvBase.VIYA_SERVER,
      authType: 'server',
      token: t,
      tokenType: 'Bearer'

    }
  } catch (err) {
    console.error(`Error reading token file: ${err}`);
  }
}

if (appEnvBase.REFRESH_TOKEN  != null) {
   appEnvBase.refreshToken = appEnvBase.REFRESH_TOKEN ;
   appEnvBase.AUTHFLOW = 'refresh';
   let t = await refreshToken(appEnvBase,{token: appEnvBase.refreshToken, host: appEnvBase.VIYA_SERVER});
    appEnvBase.logonPayload = {
      host: appEnvBase.VIYA_SERVER,
      authType: 'server',
      token: t,
      tokenType: 'Bearer'   
    }
}

if(appEnvBase.AUTHFLOW ==='sascli') {
  let logonPayload = await getLogonPayload(appEnvBase);
  appEnvBase.logonPayload = logonPayload;
}

// setup mcpServer (both http and stdio use this)
// this is singleton - best practices recommend this

let mcpServer = await createMcpServer(sessionCache, appEnvBase);

sessionCache.set('appEnvBase', appEnvBase);
let appEnvTemplate = Object.assign({}, appEnvBase);

sessionCache.set('appEnvTemplate', appEnvTemplate);

let transports = {};
sessionCache.set('transports', transports );

// set this for stdio transport use
// dummy sessionId for use in the tools  
if (mcpType === 'stdio') {
  let sessionId = randomUUID();
  sessionCache.set('currentId', sessionId);
  sessionCache.set(sessionId, appEnvBase);
  console.error('[Note] Setting up stdio transport with sessionId:', sessionId);
  console.error('[Note] Used in setting up tools and some persistence(not all).');
  await coreSSE(mcpServer); 

} else {
    console.error('[Note] Starting HTTP MCP server...');
    await corehttp(mcpServer,sessionCache, appEnvBase);
    console.error('[Note] ----------------MCP HTTP server started on port ' + appEnvBase.PORT);
}


