/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import restafedit from '@sassoftware/restafedit';
import deleteSession from './deleteSession.js';

async function _tableInfo(_appContext, params) {
  let { table, lib, server } = params;
  let logonPayload = await _appContext.toolsHelper.getLogonPayload();

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
        start: 0, // Adjust for 0-based index
        limit: 1,
        format: true,
        where: ''
      }
    }
  };


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

    //let tableSummary = await restafedit.getTableSummary(appControl);
  
    await restafedit.scrollTable('first', appControl);

    let outdata = appControl.state.data.map((d) => {
      delete d._rowIndex;
      delete d._modified;
      delete d._index_;
      return d;
    });
    let columns = appControl.state.columns;
    let structuredContent = { columns: columns, sampleData: outdata };
 
   // await deleteSession(appControl);
  
    return { content: [{ type: 'text', text: JSON.stringify(structuredContent) }], structuredContent: structuredContent };

  } catch (err) {;
   // await deleteSession(appControl);
    return { content: [{ type: 'text', text: JSON.stringify(err) }] };
  }
}
export default _tableInfo;