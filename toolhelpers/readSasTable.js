/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import  _describeTable  from './_describeTable.js';

async function readSasTable(params, userData, appControl) {
  let r = await _describeTable(params, userData, appControl);
  return r.data;
}

export default readSasTable;
