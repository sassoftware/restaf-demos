/**
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import axios from 'axios';
import debug from 'debug';
import { v4 as uuidv4 } from 'uuid';
const log = debug('scr');

async function _scrScore(params) {
  let { url, scenario, stream } = params;

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
    let r = { ...response.data, ...scenario, __key: uuidv4() }; // merge the response with the scenario and add a unique key
    if (stream === true) {
      // Convert the result to a string of the form "x=1, y=2, z=3"
      let resultString = Object.entries(r).map(([key, value]) => `${key}=${value}`).join(', ');
      return { content: [{ type: 'text', text: resultString }] };
    } else {
      return { content: [{ type: 'text', text: JSON.stringify(r) }] };
    }
    return { content: [{ type: 'text', text: JSON.stringify(response.data) }] };
  }
  catch (error) {
    return { content: [{ type: 'text', text: JSON.stringify(error) }] };
  }
}
export default _scrScore;
