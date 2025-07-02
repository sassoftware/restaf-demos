/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import restaf from '@sassoftware/restaf';
import getLogonPayload from './getLogonPayload.js';
import debug from 'debug';
const log = debug('modelList');

async function _listModels(params) {
 // setup

  let store = restaf.initStore({});
  let logonPayload = await getLogonPayload();

  try {
    await store.logon(logonPayload);
    let {microanalyticScore} = await store.addServices('microanalyticScore');
    let result = await store.apiCall(microanalyticScore.links('modules'));
    let list = result.itemsList().toJS();
    console.log('result', JSON.stringify(list, null, 2));
    await store.logoff();
    return {content: [{ type: 'text', text: JSON.stringify(list) }] };
  } catch (err) {
    log(JSON.stringify(err, null, 2));
    await store.logoff();
    return {content: [{ type: 'text', text: JSON.stringify(err) }] };
  }
}

export default _listModels;