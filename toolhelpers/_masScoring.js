/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import restaflib  from '@sassoftware/restaflib';
import restaf from '@sassoftware/restaf';
import getLogonPayload from './getLogonPayload.js';
import debug from 'debug';
const log = debug('masscoring');
async function _masScoring(params) {
 
 // setup
  let { masSetup, masDescribe, masRun } = restaflib;
  let store = restaf.initStore({});
  let logonPayload = await getLogonPayload();
  let inputs = {};
  let masControl;
  let {model, scenario, uflag} = params;
  try {
    masControl = await masSetup(store, [model], logonPayload);
    let describe = await masDescribe(masControl, model);
    inputs = {};
    describe.forEach(d => {
      inputs[d.name] = null;
    });
    log('inputs', inputs);
    if (scenario === null) {
      // if scenario is empty, return the inputs
      return { content: [{ type: 'text', text: JSON.stringify(inputs) }] };
    }
    let iscenario = {};
    for (let v in inputs) {
       let v1 = (uflag === true) ? v.substring(0, v.length - 1) : v;
       //v1 = v.startsWith('_') ? v.substring(0, v.length - 1) : v;
      let t = (scenario[v1] == null) ? null : scenario[v1];
      t  = (v.type !== 'decimal' && t != null) ? parseFloat(t) : t;
      iscenario[v] = t; 
    }
    log('iscenario', iscenario);
    let result = await masRun(store, masControl, model, iscenario);
		await store.logoff();
  
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  } catch (err) {
    log(err);
    await store.logoff();
    return { status: { statusCode: 2, msg: err }, results: {} };
  }
}

export default _masScoring;