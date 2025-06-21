/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import restaf from '@sassoftware/restaf';
import getLogonPayload from './getLogonPayload.js';

async function _modelList(params) {
 // setup

  let store = restaf.initStore({});
  let logonPayload = await getLogonPayload();

  try {
     await store.logon(logonPayload);
    console.log('logged on to server');
    let {microanalyticScore} = await store.addServices('microanalyticScore');
    console.log('added microanalyticScore service');
    let result = await store.apiCall(microanalyticScore.links('modules'));
    let list = result.itemsList().toJS();
    console.log(list);
    console.log('result', JSON.stringify(list, null, 2));
    await store.logoff();
    return {content: [{ type: 'text', text: JSON.stringify(list) }] };
  } catch (err) {
    console.log(JSON.stringify(err, null, 2));
    await store.logoff();
    return {content: [{ type: 'text', text: JSON.stringify(err) }] };
  }
}

export default _modelList;