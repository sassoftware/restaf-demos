/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import restaf from '@sassoftware/restaf';
import restaflib from '@sassoftware/restaflib';
import getLogonPayload from './getLogonPayload.js';
import _submitCode from './_submitCode.js';

async function _submitMacro(params) {
    let {macro, scenario} = params;
	try {
		let src = ` %${macro};$scenario; `; 
		// setup
		return await _submitCode(src, params);
	}
	catch (error) {
		// Oops! Something went wrong
		console.error(`Error in _submitCode: ${JSON.stringify(error)}`);
		return { content: [{ type: 'text', text: JSON.stringify(error) }] }
	}
};


export default _submitMacro;
