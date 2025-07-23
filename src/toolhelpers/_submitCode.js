/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import restaf from '@sassoftware/restaf';
import restaflib from '@sassoftware/restaflib';
import getLogonPayload from './getLogonPayload.js';
import { log } from 'console';

async function _submitCode(src, params) {
	try {
		// setup
		log('Initializing store and logon payload');
		let store = restaf.initStore({});
		let logonPayload = await getLogonPayload();
	
		// get compute sessio, run sas code and retrieve result
		log('Creating compute session');
		let computeSession = await restaflib.computeSetup(store, null, logonPayload);
		log('Submitting code to compute session');
		let computeSummary = await restaflib.computeRun(store, computeSession,src,params );
		log('Retrieving results from compute session');
		let ods = await restaflib.computeResults(store, computeSummary, "ods");

		// cleanup
		log('Session cleanup');
		await store.apiCall( computeSession.links( 'delete' ) );
		await store.logoff();

		// return results in the format the LLM expects
		log('Returning results');
		return { content: [{ type: 'text', text: ods }] };
	}
	catch (error) {
		// Oops! Something went wrong
		log(`Error in _submitCode: ${JSON.stringify(error)}`);
		return { content: [{ type: 'text', text: JSON.stringify(error) }] }
	};

}

export default _submitCode;
