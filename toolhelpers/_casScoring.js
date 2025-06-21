/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import restaflib from '@sassoftware/restaflib';
import restaf from '@sassoftware/restaf';
import getLogonPayload from './getLogonPayload.js';
async function _casScoring(params) {
  let { caslScore } = restaflib;
  let logonPayload = await getLogonPayload();
  let store = restaf.initStore({});
  
  let session = await restaflib.casSetup(store, logonPayload);
  if (session == null) {
    return {content: [{ type: 'text', text: 'Could not create a cas session' }]};
  }
 
  try {
    /*
    let args = {
      model: model,
      modelName: modelName,
      scenario: scenario
    }
      */
    let output = await caslScore(store, session, params); 
    let status = { statusCode: 0, msg: null };
    let results = output.casResults;
    return {content: [{ type: 'text', text: JSON.stringify(results) }]};
    await store.apiCall( session.links( 'delete' ) );
    store.logoff();
  } catch (err) {
    console.log(err);
    await store.apiCall( session.links( 'delete' ) );
    store.logoff();
    return { content: [{ type: 'text', text: JSON.stringify(err) }] }; 
  }
}
export default _casScoring;