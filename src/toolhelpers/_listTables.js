/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import getLogonPayload from './getLogonPayload.js';
import restafedit from '@sassoftware/restafedit';
import debug from 'debug';
import getStoreOpts from './getStoreOpts.js';


async function _listTables(params) {
  let { server, lib, limit, start, name, _appContext} = params;
  const log = debug('listtables');

  let logonPayload = await getLogonPayload(_appContext);
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
      getStoreOpts(_appContext)
    );

    let payload = {
      qs: {
        limit: (typeof limit === 'number') ? limit : 10, // Use provided limit or default to 10
        start: (typeof start === 'number') ? Math.max(0, start - 1) : 0,
      }
    };

    if (name != null) {
      // Normalize to upper-case to match table name casing in CAS (e.g. COSTCHANGE)
      const nameVal = ('' + name).toUpperCase();
      payload.qs.filter = `eq(name, '${nameVal}')`;
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