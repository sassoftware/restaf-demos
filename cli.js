#!/usr/bin/env node
import core from './src/core.js';
import { config } from 'dotenv';
import fs from 'fs';

let envf = process.argv[2] || './.env/'
console.error(`Using environment file: ${envf}`);
if (fs.existsSync(envf)) {
    console.error(`Loading environment variables from ${envf}...`);
    config({path: envf,quiet: true});
} else {
    console.error('No .env file found, Using default environment variables...');
}
    

core()
.then (() => {
    console.error('MCP Server initialized successfully.');
})
.catch((error) => {
    console.error('Error initializing MCP Server:', error);
});
