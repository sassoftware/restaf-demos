#!/usr/bin/env node
import core from './src/core.js';
import { config } from 'dotenv';
import fs from 'fs';


let envf = process.argv[2] || './.env/'
console.log(`Using environment file: ${envf}`);
if (fs.existsSync(envf)) {
    console.log(`Loading environment variables from ${envf}...`);
    config({path: envf});
} else {
    console.log('No .env file found, Using default environment variables...');
}
    

core()
.then (() => {
    console.log('MCP Server initialized successfully.');
})
.catch((error) => {
    console.error('Error initializing MCP Server:', error);
});
