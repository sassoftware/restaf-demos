/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import restaf from '@sassoftware/restaf';
import restaflib from '@sassoftware/restaflib';
import getLogonPayload from './getLogonPayload.js';
import debug from 'debug';
const log = debug('submitcode');

async function _submitCode(src, params) {
	try {
		let store = restaf.initStore({});
		let logonPayload = getLogonPayload();
		let msg = await store.logon(logonPayload);
		let computeSession = await restaflib.computeSetup(store, null, null);
		let computeSummary = await restaflib.computeRun(store, computeSession,src,params );
		let ods = await restaflib.computeResults(store, computeSummary, "ods");
		await store.logoff();
		return { content: [{ type: 'text', text: ods }] };
	}
	catch (error) {
		log(`Error in _submitCode: ${JSON.stringify(error)}`);
		return { content: [{ type: 'text', text: JSON.stringify(error) }] }
	};

}

export default _submitCode;
