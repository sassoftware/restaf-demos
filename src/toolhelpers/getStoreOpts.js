/**
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import getOptsViya from './getOptsViya.js';

function getStoreOpts(_appContext, cache) {
  debugger;
  let opts = getOptsViya(_appContext, cache);

  debugger;
  let storeOpts = {
    casProxy: true,
    httpOptions: { ...opts, rejectUnauthorized: true }
  }
  return storeOpts;
}
export default getStoreOpts;