/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import restaflib from '@sassoftware/restaflib';
import getLogonPayload from './getLogonPayload.js';
async function _submitCasl(params) {
  const { caslRun } = restaflib;
  let logonPayload = await getLogonPayload();
  let store = restaf.initStore({});
  
  let session = await restaflib.casSetup(store, logonPayload);
  if (session == null) {
    return {content: [{ type: 'text', text: 'Could not create a cas session' }]};
  }

  let { src, args } = params;
  try {
    try {
      let r = await caslRun(store, session, src, (args == null) ? {} : args, true);
      await store.apiCall( session.links( 'delete' ) );
      store.logoff()
      return {content: [{ type: 'text', text: JSON.stringify(r.items()) }], structuredContent: r.items() };
    } catch (err) {
      console.log(err);
      store.logoff();
      return { content: [{ type: 'text', text: JSON.stringify(err) }] }; 
    }
  }
  catch (err) {
    console.log(err);
    return { content: [{ type: 'text', text: JSON.stringify(err) }] }; 
  }
}
export default _submitCasl;