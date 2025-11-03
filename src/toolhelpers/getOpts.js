/**
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import fs from 'fs';
function getOpts(_appContext) {
    debugger;
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
        console.error('Reading TLS file: ' + name + ' as key: ' + key);
        options[key] = fs.readFileSync(name, { encoding: 'utf8' });
    }
    console.error('TLS FILES', Object.keys(options));
    _appContext.tlsOpts = options;
    return options;
   
}
export default getOpts;