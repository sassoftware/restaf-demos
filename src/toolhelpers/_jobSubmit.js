/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import restaf from '@sassoftware/restaf';
import restaflib from '@sassoftware/restaflib';

async function _jobSubmit(_appContext,params) {
  let { name, type, scenario,  query } = params;
  // setup
  try {
    let store = restaf.initStore({
      casProxy: true,
      options: {
        proxyServer: null,
        httpOptions: null
      }
    });
    let logonPayload = await _appContext.toolsHelper.getLogonPayload();
    let msg = await store.logon(logonPayload);
    type = type.toLowerCase();
  
    let r = (type === 'definition' || type === 'def')
      ? await restaflib.jesRun(store, name, scenario)
      : await restaflib.jobRun(store, name, scenario);

    let response = (query === true) ? {tabled: r.tables} : { tables: r.tables, listing: r.listing, log: r.log} ;
    
    
    return {
      content: [{ type: 'text', text: JSON.stringify(response) }],
      structuredContent: response
    };
  }
  catch (error) {
    // Oops! Something went wrong
    console.error(`Error in _jobSubmit: ${JSON.stringify(error)}`);
    let result = {
      tables: { Error: [{ Message: "Job failed. Please contact the owner of the job " + name }] }
    };
    return { content: [{ type: 'text', text: JSON.stringify(result) }], structuredContent: result };
  }
}

  export default _jobSubmit;
