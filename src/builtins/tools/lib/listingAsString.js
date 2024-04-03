/*
* Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/
function listingAsString(log) {
  let logText = ''
  // eslint-disable-next-line array-callback-return
  log.map((data) => {
    let line = data.line.replace( /(\r\n|\n|\r)/gm, "" );
    if ( line.length === 0 ) {
       logText += '\n';
    } else {
     logText += line + '\n';
    }
  });
  return logText;
 
}
export default listingAsString;