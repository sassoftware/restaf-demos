#!/usr/bin/env node
import core from './src/core.js';
import { config } from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import fs from 'fs';
import util from 'node:util';
let {values, positional}= util.parseArgs(process.argv.slice(2));
let envf = null;;
for (let v in values) {
    process.env[v.toUpperCase()] = values[v];
    if (v === 'envfile') {
        envf = values[v];
    }
}


// let envf = process.argv[2] || './.env/'
console.error(`Using environment file: ${envf}`);

if (process.env.ENVFILE) {
    envf = process.env.ENVFILE;
    if (fs.existsSync(envf)) {
        console.error(`Loading environment variables from ${envf}...`);
        dotenvExpand.expand(config({ path: envf, silent: true }));
    } else {
        console.error('No .env file found, Using default environment variables...');
    }
}

core()
.then (() => {
    console.error('MCP Server initialized successfully.');
})
.catch((error) => {
    console.error('Error initializing MCP Server:', error);
});
