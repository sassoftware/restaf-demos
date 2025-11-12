/**
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Helper function to get TLS options(for the app server) from specified directory
 * signed certificates 
 * for testing you can use mkcert
 * if this function return a null, coreehttp will create unsigned certs
 * @param {Object} _appContext - Application context containing SSLCERT property
 */
import fs from 'fs';
function getOpts(_appContext) {
    
     if (_appContext.tlsOpts != null) {
        return _appContext.tlsOpts;
    }
    let tlsdir = _appContext.SSLCERT;
    if (tlsdir == null || tlsdir === 'NONE') {
        return null;
    }

    console.error("[Note] Using TLS dir: " + tlsdir);
    if (fs.existsSync(tlsdir) === false) {
        console.error("[Warning] Specified TLS dir does not exist: " + tlsdir);
        return null;
    }

    let listOfFiles = fs.readdirSync(tlsdir);
    console.error("[Note] TLS/SSL files found: " + listOfFiles);
    let options = {};
    for(let i=0; i < listOfFiles.length; i++) {
        let fname = listOfFiles[i];
        let name = tlsdir + '/' + listOfFiles[i];
        let key = fname.split('.')[0];
        options[key] = fs.readFileSync(name, { encoding: 'utf8' });
    }
    console.error('TLS FILES', Object.keys(options));
    _appContext.tlsOpts = options;
    return options;
   
}
export default getOpts;