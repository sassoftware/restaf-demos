/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import restafedit from '@sassoftware/restafedit';
import getLogonPayload from './getLogonPayload.js';
async function _describeTable(params) {

  let { table, lib, limit, source, format, where} = params;
  let logonPayload = getLogonPayload();;

  let itable = {name: table};
  if (source === 'cas') {
    itable.caslib = lib;
  } else {
    itable.libname = lib;
  }
  let config = {
    source: source,
    table: itable,

    initialFetch: {
      qs: {
        start: 0,
        limit: limit || 1,
        format: true,
        where: where || ''
      }
    }
  };
  console.log('config', config);
  console.log('logonPayload', logonPayload);
  console.log(restafedit.setup);
  try {
    let appControl = await restafedit.setup(
      logonPayload,
      config,
      null,/* create a sessiion */
      {},
      'user',
      {}
    );
    console.log('appControl', appControl);
    await restafedit.scrollTable('first', appControl);
     console.log('appControl.state.data', appControl.state.data);
     let tableSummary = await restafedit.getTableSummary(appControl);
    return { content: { type: 'text', text: JSON.stringify(appControl.state.data) } };
  } catch (err) {
    console.log(err);
    return { content: { type: 'text', text: JSON.stringify(err) } };
  }
}
export default _describeTable;