/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
function rows2csv(arr) {
  // Check if there's data
  if (arr.length === 0) {
    return '';
  }

  // Extract headers
  let keys = Object.keys(arr[0]).filter(key => !(key === '_rowIndex'|| key === '_modified'));
  let headers = keys.join(',') + '\n';

  let rows ='';
  arr.map(row => {
    let line ='';
    let sep = '';
    for (let key in row) {
      if (key === '_rowIndex'|| key === '_modified') {
        continue;
      }
      line = line + sep + value2String(row[key]);
      sep = ',';
    }
    rows = rows + line + '\n';
  })
  return headers + rows;
}
function value2String (value) {
  let valueString;
  if (value == '.' || value == null) {
    valueString = '';
  } else if (typeof value === 'string') {
    value = value.replace(/"/g, '""');
    valueString = value.trim()
  } else {
    valueString = value.toString();
  }
  return valueString;
}
export default rows2csv;

