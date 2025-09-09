/**
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import fs from 'fs';
function getOpts() {
    let tlsdir = process.env.SSLCERT;
    let options = {};
    if (tlsdir != null && fs.existsSync(`${tlsdir}/key.pem`) === true) {
        options.key = fs.readFileSync(`${tlsdir}/key.pem`, { encoding: 'utf8' });
        options.cert = fs.readFileSync(`${tlsdir}/crt.pem`, { encoding: 'utf8' });
        if (fs.existsSync(`${tlsdir}/ca.pem`) === true) {
            options.ca = fs.readFileSync(`${tlsdir}/ca.pem`, { encoding: 'utf8' });
        }
        return options;
    } else {
        console.error("[Note] No TLS files found, returning null");
        return null;
    }
}
export default getOpts;