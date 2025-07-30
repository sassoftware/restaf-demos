/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import restafedit from '@sassoftware/restafedit';
import getLogonPayload from './getLogonPayload.js';
import deleteSession from './deleteSession.js';
import debug from 'debug';

async function _tableInfo(params, mode) {
  const log = debug('readtable');
  let { table, lib, start, limit, server, format, where} = params;
  let logonPayload = await getLogonPayload();
 
  let itable = {name: table};
  if (server === 'cas') {
    itable.caslib = lib;
  } else {
    itable.libref = lib;
  }
  let config = {
    source: server,
    table: itable,

    initialFetch: {
      qs: {
        start: start - 1, // Adjust for 0-based index
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
      {}
    );
    log('appControl', appControl);
     let tableSummary = await restafedit.getTableSummary(appControl);
     let t = JSON.stringify(tableSummary);
     await deleteSession(appControl);
     await appControl.store.logoff();
     log
    return { content: [{ type: 'text', text: t }] , structuredContent: tableSummary };
   
  } catch (err) {
    log(JSON.stringify(err)); 
    await deleteSession(appControl);
    await appControl.store.logoff();
    return { content: [{ type: 'text', text: JSON.stringify(err) }] };
  }
}
export default _tableInfo;