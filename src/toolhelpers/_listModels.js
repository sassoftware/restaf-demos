/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import restaf from '@sassoftware/restaf';
import getLogonPayload from './getLogonPayload.js';
import debug from 'debug';
const log = debug('modelList');

async function _listModels(params) {
  let { limit, start , name} = params;
  // setup

  let store = restaf.initStore({});
  let logonPayload = await getLogonPayload();

  try {
    await store.logon(logonPayload);
    let { microanalyticScore } = await store.addServices('microanalyticScore');
    let payload = {
      qs: {
        limit: limit || 10,
        start: start || 1 // note: bug in microanalyticScore service, start is not zero based
      }
    }
    if (name != null) {
      payload.qs = {
        filter: `eq(name, '${name}')`
      } 
    }
    let result = await store.apiCall(microanalyticScore.links('modules'), payload);
    let list = result.itemsList().toJS();
    log('result', JSON.stringify(list, null, 2));
    await store.logoff();
    return { content: [{ type: 'text', text: JSON.stringify(list) }],
      structuredContent: list
    };
  } catch (err) {
    log(JSON.stringify(err, null, 2));
    await store.logoff();
    return { content: [{ type: 'text', text: JSON.stringify(err) }] };
  }
}

export default _listModels;