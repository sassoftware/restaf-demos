/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import getLogonPayload from './getLogonPayload.js';

import restaf from '@sassoftware/restaf';
import getStoreOpts from './getStoreOpts.js';

async function _listJobs(params) {
  let { limit, start, name,_appContext } = params;

  let store = restaf.initStore({
    casProxy: true,
    options: {
      proxyServer: null,
      httpOptions: getStoreOpts(_appContext)
    }
  });
  let logonPayload = await getLogonPayload(_appContext);
  let msg = await store.logon(logonPayload);
  
  
  let {jobExecution } = await store.addServices( 'jobExecution');
  let payload = {
      qs: {
        limit: (limit != null) ? limit : 10,
        start: start - 1
      }
    };

    if (name != null && name.trim().length>0) {
      payload.qs = {
        filter: `eq(name, '${name}')`
      }
    }
  console.error('payload', JSON.stringify(payload, null, 2));
  let jobList = await store.apiCall(jobExecution.links('jobs'), payload);
  if (jobList.itemsList().size === 0) {
    return { content: [{ type: 'text', text: 'No jobs found' }]};
  }

  let names = {};
  jobList.itemsList().map( ( id, n) => {
     let jname = jobList.items(id, 'data', 'jobRequest', 'name' );
     names[jname] = jname;
  } );

  let nameList = Object.keys( names );
  console.error('job names', JSON.stringify(nameList, null, 2));
  
  return { content: [{ type: 'text', text: JSON.stringify(nameList) }],
   structuredContent: nameList
 };
}

export default _listJobs;