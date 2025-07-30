/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import getLogonPayload from './getLogonPayload.js';
import restafedit from '@sassoftware/restafedit';
import debug from 'debug';

const log = debug('listlibrary');

async function _listLibrary(params) {
  let { server, limit, start, name } = params;

  let logonPayload = await getLogonPayload();
  let config = {
    source: (server === 'sas') ? 'compute' : server,
    table: null
  };

  log(config);
  /*
  logonPayload,
  appControl,
  sessionID,
  uBuiltins,
  user,
  userData,
  storeConfig
  */
  try {
    // setup request control
    let storeConfig= {
      casProxy: true,
      options: { ns: null, proxyServer: null }
    }
    let appControl = await restafedit.setup(
      logonPayload,
      config,null,{},'user',{}, {}, storeConfig
    );

    // query parameters
    let payload = {
      qs: {
        limit: limit,
        start: start - 1
      }
    };

    if (name != null) {
      payload.qs = {
        filter: `eq(name, '${name}')`
      }
    }

    log(payload);
    let items = await restafedit.getLibraryList(appControl, payload);
    log('items', items);
    return { content: [{ type: 'text', text: JSON.stringify(items) }],
      structuredContent: items
    };
  } catch (err) {
    console.log(JSON.stringify(err));
    //  await deleteSession(appControl);
    return { content: [{ type: 'text', text: JSON.stringify(err) }] };
  }
}

export default _listLibrary;