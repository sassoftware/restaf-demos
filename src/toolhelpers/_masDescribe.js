/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import restaflib  from '@sassoftware/restaflib';
import restaf from '@sassoftware/restaf';
import getLogonPayload from './getLogonPayload.js';
import getStoreOpts from './getStoreOpts.js';

async function _masDescribe(_appContext,params) {
 // setup
  let { masSetup, masDescribe } = restaflib;
  let store = restaf.initStore({
      casProxy: true,
      options: {
        proxyServer: null,
        httpOptions: getStoreOpts(_appContext)
      }
  });
  let logonPayload = await _appContext.toolsHelper.getLogonPayload();

  let {model} = params;
  try {
    let masControl = await masSetup(store, [model], logonPayload);
    let describe = await masDescribe(masControl, model, null,true);
    return { content: [{ type: 'text', text: JSON.stringify(describe) }],
      structuredContent: describe
     };
  } catch (err) {
    console.error(err);
    return { content: [{ type: 'text', text: JSON.stringify(err) }] };
  }
}

export default _masDescribe;