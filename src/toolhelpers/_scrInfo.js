/**
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import axios from 'axios';
import debug from 'debug';
const log = debug('scr');

async function _scrInfo(params) {
  let {url} = params;
  let config = {
    method: 'GET',
    url: url + '/apiMeta/api',
    headers: {
      'Accept': 'application/json'
    }
  }
  try {
    log('Config:', config);
    let response = await axios(config);
    log('Response status:', response.status);
    let r = {
      input: response.data.components.schemas.SCRInput.properties.data.properties,
      output: response.data.components.schemas.SCROutput.properties.data.properties
    };
    log('Response data:', JSON.stringify(r, null, 2));
    return {content: [{ type: 'text', text: JSON.stringify(r)}], structuredContent: r};
  }
  catch (error) {
    return {content: [{ type: 'text', text: JSON.stringify(error) }]};  
  }
}
export default _scrInfo;
