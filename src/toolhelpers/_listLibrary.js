/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import restafedit from '@sassoftware/restafedit';
import getStoreOpts from './getStoreOpts.js';
import getLogonPayload from './getLogonPayload.js';
async function _listLibrary(params ){

  let { server, limit, start, name, _appContext } = params;
  
  let logonPayload = await getLogonPayload(_appContext);
  let config = {
    source: (server === 'sas') ? 'compute' : server,
    table: null
  };

  try {
    // setup request control
    let storeConfig= {
      casProxy: true,
      options: { ns: null, proxyServer: null, httpOptions: getStoreOpts(_appContext) }
    }
    
   // console.error('[Note] Calling restafedit.setup with logonPayload', logonPayload);
    let appControl = await restafedit.setup(
      logonPayload,
      config
      ,null,{},'user',{}, {}, storeConfig
    );
    
    // query parameters
    let payload = {
      qs: {
        limit: (limit != null) ? limit : 10,
        start: start - 1
      }
    };

    if (name != null) {
      payload.qs = {
        filter: `eq(name, '${name}')`
      }
    }
   
    let items = await restafedit.getLibraryList(appControl, payload);
  
    return { content: [{ type: 'text', text: JSON.stringify(items) }],
      structuredContent: items
    };
  } catch (err) {
    console.error(JSON.stringify(err));
    return { content: [{ type: 'text', text: JSON.stringify(err) }] };
  }
}

export default _listLibrary;