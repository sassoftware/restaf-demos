/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import getLogonPayload from './getLogonPayload.js';
import restafedit from '@sassoftware/restafedit';
import deleteSession from './deleteSession.js';
import debug from 'debug';
import { error } from 'console';
const log = debug('listlibrary');

async function _listLibrary(params) {
  let { source, library } = params;

  let logonPayload = getLogonPayload();
  let config = {
    source: source,
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
        limit: 1000,
        start: 0,
      }
    };
    library = library.trim();
    if (library !== '*'){
      payload.qs.filter = `eq(name, '${library}')`;
    }
    log(payload);
    let items = await restafedit.getLibraryList(appControl, payload);
    log('items', items);
    return items;
  } catch (err) {
    log(JSON.stringify(err));
    //  await deleteSession(appControl);
    throw err;
  }

};


export default _listLibrary;