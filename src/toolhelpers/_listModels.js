/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import restaf from '@sassoftware/restaf';
import getLogonPayload from './getLogonPayload.js';
import getStoreOpts from './getStoreOpts.js';


async function _listModels(params) {
  let { limit, start , name, _appContext} = params;;
  // setup

  let store = restaf.initStore({
      casProxy: true,
      options: {
        proxyServer: null,
         options: { ns: null, proxyServer: null, httpOptions: getStoreOpts(_appContext) }
      }
  });
  let logonPayload = await getLogonPayload(_appContext);

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
    let result = await store.apiCall(microanalyticScore.links('modules'), payload);
    if (result.itemsList().size === 0) {
      return { content: [{ type: 'text', text: `No models exist in MAS server` }]};
    }
    let list = result.itemsList().toJS();
    return { content: [{ type: 'text', text: JSON.stringify(list) }],
      structuredContent: list
    };
  } catch (err) {
    return { isError: true, content: [{ type: 'text', text: JSON.stringify(err) }] };
  }
}

export default _listModels;