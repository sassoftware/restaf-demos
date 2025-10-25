/**
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import getOpts from './getOpts.js';

function getStoreOpts(_appContext) {
  debugger
  let opts = getOpts(_appContext);
  if (opts == null) {
    opts = {};
  }
  debugger;
  let storeOpts = {
    casProxy: true,
    httpOptions: { ...opts, rejectUnauthorized: true }
  }
  console.error('STORE OPTS', storeOpts);
  return storeOpts;
}
export default getStoreOpts;