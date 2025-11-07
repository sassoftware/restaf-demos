/**
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import fs from 'fs';
function getOptsViya(_appContext) {
    debugger;
     if (_appContext.viyaOpts != null) {
        console.error('[Note] Using cached viyaOpts', _appContext.viyaOpts);
        return _appContext.viyaOpts;
    }
    let tlsdir = _appContext.viyaSSL;
    console.error('--------------------------------VIYASSL dir: ' + tlsdir);
    if (tlsdir == null || tlsdir === 'NONE') {
        return {};
    }

    console.error(`[Note] Using VIYASSL dir: ` + tlsdir);
    if (fs.existsSync(tlsdir) === false) {
        console.error("[Warning] Specified VIYASSL dir does not exist: " + tlsdir);
        return {};
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
    console.error('VIYASSL FILES', Object.keys(options));
    _appContext.viyaOpts = options;
    return options;
   
}
export default getOptsViya;