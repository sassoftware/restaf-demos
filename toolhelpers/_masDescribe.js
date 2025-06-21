/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import restaflib  from '@sassoftware/restaflib';
import restaf from '@sassoftware/restaf';
import getLogonPayload from './getLogonPayload.js';

async function _masDescribe(params) {
 // setup
  let { masSetup, masDescribe } = restaflib;
  let store = restaf.initStore({});
  let logonPayload = await getLogonPayload();
  let inputs = {};
  let masControl;
  let {model} = params;
  try {
    masControl = await masSetup(store, [model], logonPayload);
    let describe = await masDescribe(masControl, model);
    console.log('describe', describe);
    return { content: [{ type: 'text', text: JSON.stringify(describe) }] };
  } catch (err) {
    console.log(err);
    await store.logoff();
    return { content: [{ type: 'text', text: JSON.stringify(err) }] };
  }
}

export default _masDescribe;