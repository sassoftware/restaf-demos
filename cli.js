import core  from './src/core.js';
if (process.argv[2] === 'https'){
    process.env.HTTPS = true;
}
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
core();
