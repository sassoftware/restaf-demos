/**
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import axios from 'axios';
import debug from 'debug';
const log = debug('scr');

async function _scrScore(params) {
  let { url, scenario} = params;

  let data = scenario.split(',').reduce((acc, pair) => {
    let [key, value] = pair.split('=');
    acc[key.trim()] = value.trim();
    return acc;
  }, {});

  let config = {
    method: 'POST',
    url: url,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: data
  };

  try {
    log('Config:', config);
    let response = await axios(config);
    log('Response status:', response.status);
    log(response.data);
     let t = ' ';
    let sep = ''
    for (let k in r) {
      t += sep + k + '=' + r[k];
      sep = ', ';
    }
    console.log('t', t);
    let r = { ...response.data, ...scenario }; // merge the response with the scenario and add a unique key
    return { content: [{ type: 'text', text: t }], structuredContent: r };
  
  }
  catch (error) {
    return { content: [{ type: 'text', text: JSON.stringify(error) }] };
  }
}
export default _scrScore;
