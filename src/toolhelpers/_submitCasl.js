/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import restaflib from '@sassoftware/restaflib';
import getLogonPayload from './getLogonPayload.js';
async function _submitCasl(params) {
  let { src, args, _appContext } = params;
  let logonPayload = await getLogonPayload(_appContext);
   let store = restaf.initStore({
      casProxy: true,
      options: {
        proxyServer: null,
        httpOptions: getStoreOpts(_appContext)
      }
  });
  
  let session = await restaflib.casSetup(store, logonPayload, null, _appContext.contexts.cas);
  if (session == null) {
    return {content: [{ type: 'text', text: 'Could not create a cas session' }]};
  }

  
  try {
    try {
      let r = await caslRun(store, session, src, (args == null) ? {} : args, true);
      await store.apiCall( session.links( 'delete' ) );
    
      return {content: [{ type: 'text', text: JSON.stringify(r.items()) }], structuredContent: r.items() };
    } catch (err) {
      console.error(err);
     
      return { content: [{ type: 'text', text: JSON.stringify(err) }] }; 
    }
  }
  catch (err) {
    console.error(err);
    await store.apiCall( session.links( 'delete' ) );
    return { isError: true, content: [{ type: 'text', text: JSON.stringify(err) }] }; 
  }
}
export default _submitCasl;