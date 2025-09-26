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
    console.log(name, type, scenario);
    debugger;
    let r = (type === 'definition' || type === 'def')
      ? await restaflib.jesRun(store, name, scenario)
      : await restaflib.jobRun(store, name, scenario);
    let output = {log: r.log, listing: r.listing};
    return {
      content: [{type: 'text', text: JSON.stringify(output) }],
      structuredContent: output
    };
  }
  catch (error) {
    // Oops! Something went wrong
    console.error(`Error in _jobSubmit: ${JSON.stringify(error)}`);
    let e = { error: error };
    return { content: [{ type: 'text', text: JSON.stringify(e) }], structuredContent: e };
  }
  function log2html(log) {
    let logText = '';
    // eslint-disable-next-line array-callback-return
    log.map((data) => {
      let line = data.line.replace(/(\r\n|\n|\r)/gm, "");
      if (line.length === 0) {
        logText = logText + '\n';
      } else { }
      logText = logText + line + '\n';
    });
    return logText;
  };
}

export default _jobSubmit;
