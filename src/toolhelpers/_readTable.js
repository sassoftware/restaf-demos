/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import restafedit from '@sassoftware/restafedit';
import getLogonPayload from './getLogonPayload.js';
import deleteSession from './deleteSession.js';
import getStoreOpts from './getStoreOpts.js';
import debug from 'debug';

async function _readTable(_appContext,params) {
  const log = debug('readtable');
  let { table, lib, start, limit, server, format, where } = params;
  let logonPayload = await _appContext.toolsHelper.getLogonPayload();
  log('logonPayload', logonPayload);

  if (table.includes('.')) {
    let parts = table.split('.');
    lib = parts[0];
    table = parts[1];
  }
  let itable = { name: table };
  if (server === 'cas') {
    itable.caslib = lib;
  } else {
    itable.libref = lib;
  }
  let config = {
    source: (server === 'sas') ? 'compute' : server,
    table: itable,

    initialFetch: {
      qs: {
        start: (start == null) ? 0 : start - 1, // Adjust for 0-based index
        limit: limit,
        format: format || false,
        where: where || ''
      }
    }
  };
  log('config', config);
  log('logonPayload', logonPayload);

  let appControl = {};
  try {
    appControl = await restafedit.setup(
      logonPayload,
      config,
      null,/* create a sessiion */
      {},
      'user',
      getStoreOpts(_appContext)
    );
    log('appControl', appControl);
    await restafedit.scrollTable('first', appControl);
    log('appControl.state.data', appControl.state.data);
    let outdata = appControl.state.data.map((d) => {
      delete d._rowIndex;
      delete d._modified;
      delete d._index_;
      return d;
    });


    //await deleteSession(appControl);

    let t = (limit === 1) ? JSON.stringify(outdata[0]) : JSON.stringify(outdata);
    return { content: [{ type: 'text', text: t }], structuredContent: outdata };

  } catch (err) {
    log(JSON.stringify(err));
    //await deleteSession(appControl);

    return { content: [{ type: 'text', text: JSON.stringify(err) }],
     };
  }
}
export default _readTable;