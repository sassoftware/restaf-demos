import core  from './src/core.js';
if (process.argv[2] === 'https'){
    process.env.HTTPS = true;
}
core();
