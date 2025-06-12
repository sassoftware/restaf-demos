/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import restafedit from '@sassoftware/restafedit';
import getLogonPayload from './getLogonPayload.js';
import deleteSession from './deleteSession.js';
import debug from 'debug';
const log = debug('read');
async function _describeTable(params, mode) {

  let { table, lib, limit, source, format, where} = params;
  let logonPayload = getLogonPayload();
  log('logonPayload', logonPayload);

  let itable = {name: table};
  if (source === 'cas') {
    itable.caslib = lib;
  } else {
    itable.libref = lib;
  }
  let config = {
    source: source,
    table: itable,

    initialFetch: {
      qs: {
        start: 0,
        limit: limit || 1,
        format: format,
        where: where || ''
      }
    }
  };
  log('config', config);
  log('logonPayload', logonPayload);
  log(restafedit.setup);
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
    await restafedit.scrollTable('first', appControl);
     log('appControl.state.data', appControl.state.data);
     let tableSummary = await restafedit.getTableSummary(appControl);
     let t = (mode === 'describe') ? JSON.stringify(tableSummary) : JSON.stringify(appControl.state.data);
     await deleteSession(appControl);
      await appControl.store.logoff();
    return { content: [{ type: 'text', text: t }] };
   
  } catch (err) {
    log(JSON.stringify(err)); 
    await deleteSession(appControl);
    await appControl.store.logoff();
    return { content: [{ type: 'text', text: JSON.stringify(err) }] };
  }
}
export default _describeTable;