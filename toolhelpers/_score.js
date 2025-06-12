/**
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import axios from 'axios';
import debug from 'debug';
const log = debug('score');
async function _score(url, params) {

  let data = {};
  //skip undefined and null values
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value != null) {
      data[key] = value;
    }
  } 

  let config = {
    method: 'POST',
    url: url,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: data
  }
  try {
    console.log('Config:', config);
    let response = await axios(config);
    console.log('Response status:', response.status);
    console.log(response.data.outputs);
    return { outputs: response.data.outputs, error: null };  
  }
  catch (error) {
    return {outputs: null, error: error};
  }
}
export default _score;
