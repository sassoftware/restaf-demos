/*
 * Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

async function addClient (store, clientid, args, defaultConfigFile, ttl) {
	
    
	let clientSecret = (args.secret != null) ? args.secret.trim() : null;
	let redirect = (args.redirect != null) ? args.redirect.trim() : null;
	let configFile = (args.configFile == null) ? defaultConfigFile : args.configFile;
	
	if (configFile == null) {
		let flow = (args.type  != null) ? args.type.trim() : ' ';
		console.log(flow);
		
		if (flow === 'code') {
			flow = 'authorization_code';
		}
		
		let flowA = flow.split(',');
		configFile = {
			client_id   : clientid,
			scope       : ['openid',"*"],
			resource_ids: ['none'],
			autoapprove : true,

			authorized_grant_types: flowA,
			access_token_validity : (ttl == null) ? 86400 : ttl*24*60*60,
           // "refresh_token_validity": 86400,
			'use-session'         : true
		};
		if (clientSecret !== null) {
			configFile.client_secret = clientSecret;
		}
		let redirectx = (redirect != null) ? redirect.replaceAll("$VIYA_SERVER",process.env.VIYA_SERVER) : null;
		if (redirectx != null) {
			let redirectA = redirectx.split(',');
			configFile.redirect_uri = redirectA;
		}
	} 

	
	
	let payload = {
		url   : `${store.connection()['host']}/SASLogon/oauth/clients`,
		method: 'POST',
		data  : configFile,

		headers: {
			'Content-Type': 'application/json',
			accept        : 'application/json',
			authorization : 'bearer ' + store.connection()['token']
		}
	};

	console.log(configFile);
	try {
		let r = await store.request(payload);
		return `${clientid} has been added`;
	} catch (err) {
		return err.response.data;
	}
};
export default addClient;
