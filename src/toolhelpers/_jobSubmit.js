/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import restaf from '@sassoftware/restaf';
import restaflib from '@sassoftware/restaflib';
import getLogonPayload from './getLogonPayload.js';



async function _jobSubmit(params) {
  let { name, type, scenario, limit, output } = params;
  // setup
  try {
    let store = restaf.initStore({
      casProxy: true,
      options: {
        proxyServer: null,
        httpOptions: null
      }
    });
    let logonPayload = await getLogonPayload();
    let msg = await store.logon(logonPayload);
    type = type.toLowerCase();
  //  console.error(name, type, scenario);
    
    let r = (type === 'definition' || type === 'def')
      ? await restaflib.jesRun(store, name, scenario)
      : await restaflib.jobRun(store, name, scenario);  
    let response = {
      tables: r.tables,
      listing: r.listing,
      log: r.log
    };
    
    
    return {
      content: [{ type: 'text', text: JSON.stringify(response) }],
      structuredContent: response
    };
  }
  catch (error) {
    // Oops! Something went wrong
    console.error(`Error in _jobSubmit: ${JSON.stringify(error)}`);
    let result = {
      tables: { Error: [{ Message: "Job failed. Please contact your SAS administrator." }] }
    };
    return { content: [{ type: 'text', text: JSON.stringify(result) }], structuredContent: result };
  }
}

  export default _jobSubmit;
