/*
* Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/
/**
 * 
 * @param {string} table as a.b
 * @param {string} source (cas or compute)
 * @returns {object} - {libref: a, name: b} or null
 */
function string2Table(table, source) {
  let iTable = {};
  let lib = (source === 'cas') ? 'caslib' : 'libref';
  let parts = table.split('.');  
  if (parts.length === 2) {
    iTable[lib] = parts[0];
    iTable.name = parts[1];
    return iTable;
  } else {
    return null;
  }
}
export default string2Table;