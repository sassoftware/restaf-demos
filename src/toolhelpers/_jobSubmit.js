/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import restaf from '@sassoftware/restaf';
import restaflib from '@sassoftware/restaflib';
import getLogonPayload from './getLogonPayload.js';
import getStoreOpts from './getStoreOpts.js';

async function _jobSubmit(params) {
  let { name, type, scenario,  query, _appContext } = params;
  // setup
  try {
    let store = restaf.initStore({
      casProxy: true,
      options: {
        proxyServer: null,
        httpOptions: getStoreOpts(_appContext)
      }
    });
    let logonPayload = await getLogonPayload(_appContext);
   
    let msg = await store.logon(logonPayload);
   
    type = (type == null) ? 'job' : type.toLowerCase();
    console.error(`Submitting job. Name: ${name} Type: ${type} Scenario: ${JSON.stringify(scenario)}`);
    debugger;
    let r = (type === 'definition' || type === 'def')
      ? await restaflib.jesRun(store, name, scenario)
      : await restaflib.jobRun(store, name, scenario);
  
    let response = (query === true) ? {tabled: r.tables} : { tables: r.tables, listing: r.listing, log: r.log} ;
    debugger;
    return {
  
      content: [{ type: 'text', text: JSON.stringify(response) }],
      structuredContent: response
    };
  }
  catch (error) {
    // Oops! Something went wrong
    debugger
    console.error(`Error in _jobSubmit: ${JSON.stringify(error)}`);
    let result = {
      tables: { Error: [{ Message: "Job failed. Please contact the owner of the job " + name }] }
    };
    return { isError: true, content: [{ type: 'text', text: JSON.stringify(result) }], structuredContent: result };
  }
}

  export default _jobSubmit;
