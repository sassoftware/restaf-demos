/*
 * ------------------------------------------------------------------------------------
 *   Copyright (c) SAS Institute Inc.
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 * ---------------------------------------------------------------------------------------
 *
 */

"use strict";

let fs = require('fs');


module.exports = function config () {

	let appEnv = '../.env';

	console.log('---------------------------------------');
	console.log(`env file set to: ${appEnv}`);
	console.log('---------------------------------------');

	if (appEnv != null) {
		iconfig(appEnv);
	}

	if (process.env.TOKENFILE != null) {
		return {
			authType    : "server",
			host        : process.env.VIYA_SERVER,
			token       : fs.readFileSync(process.env.TOKENFILE, 'utf8'),
			tokenType   : 'bearer'
		}
	} else {
		return {
			authType    : "password",
			host        : process.env.VIYA_SERVER,
			clientID    : 'sas.ec',
			clientSecret: '',
			user        : process.env.USER,
			password    : process.env.PASSWORD
		}
	}
}

function iconfig (appEnv) {
	try {
		let data = fs.readFileSync(appEnv, 'utf8');
		let d = data.split(/\r?\n/);
		console.log('Configuration specified via raf.env');
		d.forEach(l => {
			if (l.length > 0 && l.indexOf('#') === -1) {
				let la = l.split('=');
				let envName = la[0];
				if (la.length === 2 && la[1].length > 0) {
					process.env[envName] = la[1];
				} else {
					console.log(
						`${envName} inherited as ${process.env[envName]}`
					);
				}
			}
		});
	} catch (err) {
		console.log(err);
		process.exit(0);
	}
}
