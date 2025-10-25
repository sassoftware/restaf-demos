/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import restaflib from '@sassoftware/restaflib';
import restaf from '@sassoftware/restaf';
;
import getStoreOpts from './getStoreOpts.js';
async function _casScoring(_appContext,params) {
  let { caslScore } = restaflib;
  let logonPayload = await _appContext.toolsHelper.getLogonPayload();
  let store = restaf.initStore({
       casProxy: true,
       options: {
         proxyServer: null,
         httpOptions: getStoreOpts(_appContext)
       }
   });
  
  let session = await restaflib.casSetup(store, logonPayload);
  if (session == null) {
    return {content: [{ type: 'text', text: 'Could not create a cas session' }]};
  }
 
  try {
    let output = await caslScore(store, session, params); 
    let status = { statusCode: 0, msg: null };
    let results = output.casResults;
    await store.apiCall( session.links( 'delete' ) );
    return {content: [{ type: 'text', text: JSON.stringify(results) }], structuredContent: results};
   
   
  } catch (err) {
    console.error(err);
    await store.apiCall( session.links( 'delete' ) );

    return { content: [{ type: 'text', text: JSON.stringify(err) }] }; 
  }
}
export default _casScoring;