#!/usr/bin/env node
import core from './src/core.js';
import { config } from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import fs from 'fs';

debugger;

let mcpType = process.env.MCPTYPE || 'http';

if (mcpType === 'http') {
    process.env.MCPTYPE = mcpType; // ensure env variable is set
}
debugger;

// read .env file if exists
let envf = './env';
if (fs.existsSync(envf)) {
    console.error(`Loading environment variables from ${envf}...`);
    dotenvExpand.expand(config({ path: envf, silent: true }));
} else {
    console.error('[Note]: No .env file found, Using default environment variables...');
}

const appEnv = {
    mcpType: mcpType,
    HTTPS: (process.env.HTTPS != null && process.env.HTTPS.toUpperCase() === 'TRUE') ? true : false,
    SAS_CLI_PROFILE: process.env.SAS_CLI_PROFILE || 'default',
    SAS_CLI_CONFIG: process.env.SAS_CLI_CONFIG || (process.env.HOME),  // default to user home directory
    SSLCERT: process.env.SSLCERT || null,
    AUTHFLOW: process.env.AUTHFLOW || 'sascli',
    VIYA_SERVER: process.env.VIYA_SERVER,
    PORT: process.env.PORT || 8080,
    USERNAME: process.env.USERNAME || null,
    PASSWORD: process.env.PASSWORD || null,
    CLIENTIDPW: process.env.CLIENTIDPW || null,
    CLIENTSECRET: process.env.CLIENTSECRETPW || null,
    TOKEN: process.env.TOKEN || null,
    TLS_CREATE: process.env.TLS_CREATE || null,
    //runtime variables
    tls: null,
    transports: {},
    mcpServer: null,
    store: null,
    casServer: null,
    casSessionId: null,
    computeSessionId: null,

};
core(appEnv)
    .then(() => {
        console.error('MCP Server initialized successfully.');
    })
    .catch((error) => {
        console.error('Error initializing MCP Server:', error);
    });
