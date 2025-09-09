/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import getLogonPayload from './getLogonPayload.js';
import restafedit from '@sassoftware/restafedit';
import debug from 'debug';
import getStoreOpts from './getStoreOpts.js';


async function _listTables(params) {
  let { server, lib, limit, start, name} = params;
  const log = debug('listtables');

  let logonPayload = await getLogonPayload();
  let config = {
    source: (server === 'sas') ? 'compute' : server,
    table: null
  };
  log(config);
  try {
    let appControl = await restafedit.setup(
      logonPayload,
      config,
      null,/* create a session */
      {},
      'user',
      getStoreOpts()
    );

    let payload = {
      qs: {
        limit: limit || 10, // Use the limit from params or default to 1000
        start: start - 1,
      }
    };

    if (name != null) {
      payload.qs = {
        filter: `eq(name, '${name}')`
      }
    }
    log(payload);
    let items = await restafedit.getTableList(lib, appControl, payload);
    log('items', items);
    return {content: [{ type: 'text', text: JSON.stringify(items) }],
      structuredContent: items};
  } catch (err) {
    log(JSON.stringify(err));
    return {content: [{ type: 'text', text: JSON.stringify(err) }] }
  }

};


export default _listTables;