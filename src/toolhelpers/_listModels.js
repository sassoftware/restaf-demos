/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import restaf from '@sassoftware/restaf';
import getLogonPayload from './getLogonPayload.js';
import getOpts from './getOpts.js';
import debug from 'debug';
import getStoreOpts from './getStoreOpts.js';


async function _listModels(_appContext,params) {
  let { limit, start , name} = params;
  const log = debug('modelList');
  // setup

  let store = restaf.initStore({
      casProxy: true,
      options: {
        proxyServer: null,
        httpOptions: getStoreOpts()
      }
  });
  let logonPayload = await _appContext.toolsHelper.getLogonPayload();

  try {
    await store.logon(logonPayload);
    let { microanalyticScore } = await store.addServices('microanalyticScore');
    let payload = {
      qs: {
        limit: Math.max(limit,1),
        start:  Math.max(start-1, 0)
      }
    }
    if (name != null) {
      payload.qs = {
        filter: `eq(name, '${name}')`
      } 
    }
    console.error('payload', JSON.stringify(payload, null, 2));
    let result = await store.apiCall(microanalyticScore.links('modules'), payload);
    let list = result.itemsList().toJS();
    log('result', JSON.stringify(list, null, 2));
    return { content: [{ type: 'text', text: JSON.stringify(list) }],
      structuredContent: list
    };
  } catch (err) {
    log(JSON.stringify(err, null, 2));
    return { content: [{ type: 'text', text: JSON.stringify(err) }] };
  }
}

export default _listModels;