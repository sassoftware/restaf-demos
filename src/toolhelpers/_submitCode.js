/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import restaf from '@sassoftware/restaf';
import restaflib from '@sassoftware/restaflib';
import getLogonPayload from './getLogonPayload.js';
import getStoreOpts from './getStoreOpts.js';


async function _submitCode(params) {
  let { output, limit, args, src, _appContext } = params;
  try {
    // setup
    let store = restaf.initStore({
      casProxy: true,
      options: {
        proxyServer: null,
        httpOptions:  getStoreOpts(_appContext)
      }
    });
    let logonPayload = await getLogonPayload(_appContext);

    // get compute sessio, run sas code and retrieve result

    let computeSession = await restaflib.computeSetup(store, null, logonPayload);
    let computeSummary = await restaflib.computeRun(store, computeSession, src, args);

    let jobStatus = computeSummary.SASJobStatus;
    let structuredOutput = {};
    if (jobStatus === 'failed' || jobStatus === 'error' || jobStatus === 'running') {
      let msg = `Job  ended with status of ${jobStatus}. Please check the log for errors.`;
      let log = await computeResults(store, computeSummary, 'log');
      let status = { status: { statusCode: 2, msg: msg } };
      structuredOutput = { status, log: log2html(log) };
    }
    else {
      let ods = await restaflib.computeResults(store, computeSummary, "ods");
      let log = await restaflib.computeResults(store, computeSummary, "log");
      let listing = await restaflib.computeResults(store, computeSummary, "listing");
      let tables = await restaflib.computeResults(store, computeSummary, 'tables');
      let cc = jobStatus === 'warning' ? 1 : 0;
      let status = { status: { statusCode: cc, msg: `Job completed with status ${jobStatus}` } };

      let rows = [];
      let notes = ' ';
      if (output != null && output.trim().length > 0 && output.trim().toLowerCase() !== 'none') {
        if (tables.includes(output.toUpperCase()) === false) {
          let msg = `The requested output table ${output} was not found in the response. 
                     Please check the tables element for available tables.`;
          notes = { status: { statusCode: 1, msg: msg } };
        } else {
          let tpayload = {
            qs: {
              limit: (limit != null) ? limit : 100,
              start: 0
            }
          }
          rows = await restaflib.computeFetchData(store, computeSummary, output, null, tpayload);
        }
      }
      structuredOutput = { status, ods, log: log2html(log), listing: log2html(listing), tables: tables, output: output, rows: rows, notes: notes };
    }
    // add output tables next

    // cleanup
    await store.apiCall(computeSession.links('delete'));
   
    // return results in the format the LLM expects

    return {
      content: [{ type: 'text', text: JSON.stringify(structuredOutput) }],
      structuredContent: structuredOutput
    };
  }
  catch (error) {
    // Oops! Something went wrong
    console.error(`Error in _submitCode: ${JSON.stringify(error)}`);
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

export default _submitCode;
