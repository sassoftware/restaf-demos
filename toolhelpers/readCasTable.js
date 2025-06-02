/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import  _describeTable  from './_describeTable.js';

async function readCasTable(params) {
  params.table='cars';
  params.lib='Public';
  params.source='cas';
  params.format= true
  debugger;
 
  let r = await _describeTable(params);
  return r;
}

export default readCasTable;
