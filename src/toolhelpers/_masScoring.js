/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import restaflib  from '@sassoftware/restaflib';
import restaf from '@sassoftware/restaf';
import getLogonPayload from './getLogonPayload.js';

import debug from 'debug';

async function _masScoring(params) {
 const log = debug('masscoring');
 // setup
  let { masSetup, masDescribe, masRun } = restaflib;
  let store = restaf.initStore({
      casProxy: true,
      options: {
        proxyServer: null,
        httpOptions: null
      }
  });
  let logonPayload = await getLogonPayload();
  let inputs = {};
  let masControl;
  let {model, scenario, uflag, stream} = params;
  try {
   
    masControl = await masSetup(store, [model], logonPayload);
    let describe = await masDescribe(masControl, model);
    let inputs = {};
    let types = {};
    describe.forEach(d => {
      inputs[d.name] = null;
      types[d.name] = d.type;
    });
    
    log('inputs', inputs);
    if (scenario === null) {
      // if scenario is empty, return the inputs
      return { content: [{ type: 'text', text: JSON.stringify(inputs) }] };
    }
    let iscenario = {};
    
    for (let v in inputs) {
       let v1 = (uflag === true) ? v.substring(0, v.length - 1) : v;
      let t = (scenario[v1] == null) ? null : scenario[v1];
      log('t', t, typeof t, v1, types[v]);
      t  = (types[v] === 'decimal' && typeof t === 'string'   ) ? parseFloat(t) : t;
      iscenario[v] = t; 
    }
   
    let result = await masRun(store, masControl, model, iscenario);

    // add a unique key for the result
		await store.logoff();
    let r = {...result, ...iscenario};
    log(r);
    let t = '';
    let sep = ''
    for (let k in r) {
      t += sep + k + '=' + r[k];
      sep = ', ';
    }
    log('text content', t);
    return { content: [{ type: 'text', text: JSON.stringify(r)}], structuredContent: r};
  
  } catch (err) {
    log(err);
    await store.logoff();
    return { content: [{ type: 'text', text: JSON.stringify({ status: { statusCode: 2, msg: err }, results: {} }) }] };
  }
}

export default _masScoring;

