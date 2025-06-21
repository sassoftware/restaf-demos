/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import getLogonPayload from './getLogonPayload.js';
import restafedit from '@sassoftware/restafedit';
import debug from 'debug';

const log = debug('listtables');

async function _listTables(params) {
  let { server, lib, limit} = params;

  let logonPayload = await getLogonPayload();
  let config = {
    source: server,
    table: null
  };
  let appControl = {};
  log(config);
  try {
    let appControl = await restafedit.setup(
      logonPayload,
      config,
      null,/* create a sessiion */
      {},
      'user',
      {}
    );

    let payload = {
      qs: {
        limit: limit || 20, // Use the limit from params or default to 1000
        start: 0,
      }
    };

    log(payload);
    let items = await restafedit.getTableList(lib, appControl, payload);
    log('items', items);
    return {content: [{ type: 'text', text: JSON.stringify(items) }] };
  } catch (err) {
    log(JSON.stringify(err));
    return {content: [{ type: 'text', text: JSON.stringify(err) }] }
  }

};


export default _listTables;