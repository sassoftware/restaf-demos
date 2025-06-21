/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import restaflib  from '@sassoftware/restaflib';
import restaf from '@sassoftware/restaf';
import getLogonPayload from './getLogonPayload.js';

/**
 * @description Score a MAS model
 * @async
 * @private
 * @module masScoring
 * @category builtins
 * @param {string} modelName - published name
 * @param {object} data - data to be scored
 * @param {boolean} uflag - if true, remove the last character(_) from the variable name
 * @param {*} appEnv - appEnv
 * @returns {object} - {status: {statusCode: 0, msg: null}, results: masRun results}
 * @example
 * let result = await appEnv.builtins.masScoring('mycoolmodel', {x1: 1, x2: 2}, appEnv);
 * 
 */
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
    console.log('inputs', inputs);
    if (scenario === null) {
      // if scenario is empty, return the inputs
      return { content: [{ type: 'text', text: JSON.stringify(inputs) }] };
    }
    let iscenario = {};
    for (let v in inputs) {
       let v1 = (uflag === true) ? v.substring(0, v.length - 1) : v;
       //v1 = v.startsWith('_') ? v.substring(0, v.length - 1) : v;
      iscenario[v] = (scenario[v1] == null) ? null : scenario[v1];
    }
    console.log('iscenario', iscenario);
    let result = await masRun(store, masControl, model, iscenario);
		await store.logoff();
  
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  } catch (err) {
    console.log(err);
    await store.logoff();
    return { status: { statusCode: 2, msg: err }, results: {} };
  }
}

export default _masScoring;