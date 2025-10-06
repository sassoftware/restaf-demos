/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import getLogonPayload from './getLogonPayload.js';

import restaf from '@sassoftware/restaf';
import getStoreOpts from './getStoreOpts.js';
import debug from 'debug';

async function _listJobs(params) {
  let { limit, start, name } = params;

  let store = restaf.initStore({
    casProxy: true,
    options: {
      proxyServer: null,
      httpOptions: getStoreOpts()
    }
  });
  let logonPayload = await getLogonPayload();
  let msg = await store.logon(logonPayload);
  console.error('logon', msg);
  
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
  let items = jobList.itemsList();
  return { content: [{ type: 'text', text: JSON.stringify(items) }],
   structuredContent: items
 };
}

export default _listJobs;