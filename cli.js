#!/usr/bin/env node
import core from './src/core.js';
import { config } from 'dotenv';
import fs from 'fs';

if (fs.existsSync('./.env')) {
    console.log('Loading environment variables from .env file...');
    config();
} else {
    console.log('No .env file found, Using default environment variables...');
}

if (process.argv[2] === 'https') {
    process.env.HTTPS = true;
}
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
core()
.then (() => {
    console.log('MCP Server initialized successfully.');
})
.catch((error) => {
    console.error('Error initializing MCP Server:', error);
});
