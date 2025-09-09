/**
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import getOpts from './getOpts.js';

function getStoreOpts() {
  let opts = getOpts();
  let storeOpts = {
    casProxy: true,
    httpOptions: { ...opts, rejectUnauthorized: true }
  }

  return storeOpts;
}
export default getStoreOpts;