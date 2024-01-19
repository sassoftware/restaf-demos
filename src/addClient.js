/*
 * Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

module.exports = async function addClient (store, clientid, args, defaultConfigFile, ttl) {
	
    
	let clientSecret = (args.secret != null) ? args.secret.trim() : null;
	let redirect = (args.redirect != null) ? args.redirect.trim() : null;
	let configFile = (args.configFile == null) ? defaultConfigFile : args.configFile;
	if (configFile == null) {
		let flow = (args.type  != null) ? args.type.trim() : ' ';
			if (clientid === 'code') {
			clientid = 'authorization_code';
		}
		let flowA = flow.split(',');
		configFile = {
			client_id   : clientid,
			scope       : ['openid',"*"],
			resource_ids: ['none'],
			autoapprove : true,

			authorized_grant_types: flowA,
			// access_token_validity : (ttl == null) ? 86400 : ttl*24*60*60,
			'use-session'         : true
		};
		if (clientSecret !== null) {
			configFile.client_secret = clientSecret;
		}
		if (redirect != null) {
			let redirectA = redirect.split(',');
			configFile.redirect_uri = redirectA;
		}
	} 

	
	
	let payload = {
		url   : `${process.env.VIYA_SERVER}/SASLogon/oauth/clients`,
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
