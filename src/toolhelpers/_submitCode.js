/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import restaf from '@sassoftware/restaf';
import restaflib from '@sassoftware/restaflib';
import getLogonPayload from './getLogonPayload.js';



async function _submitCode(src, params) {

	try {
		// setup
		let store = restaf.initStore({
			casProxy: true,
			options: {
				proxyServer: null,
				httpOptions: null
			}
		});
		let logonPayload = await getLogonPayload();

		// get compute sessio, run sas code and retrieve result
	
		let computeSession = await restaflib.computeSetup(store, null, logonPayload);
		let computeSummary = await restaflib.computeRun(store, computeSession, src, params);
		let ods = await restaflib.computeResults(store, computeSummary, "ods");
		let log = await restaflib.computeResults(store, computeSummary, "log");
		let tables = await restaflib.computeResults(store, computeSummary, 'tables');
		let structuredOutput = { ods, log, tables: tables };
		// add output tables next

		// cleanup
		await store.apiCall(computeSession.links('delete'));
		await store.logoff();

		// return results in the format the LLM expects
	
		return {
			content: [{ type: 'text', text: JSON.stringify(structuredOutput) }],
			structuredContent: structuredOutput
		};
	}
	catch (error) {
		// Oops! Something went wrong
		console.error(`Error in _submitCode: ${JSON.stringify(error)}`);
		return { content: [{ type: 'text', text: JSON.stringify(error) }] }
	}
};


export default _submitCode;
