/*
 * ------------------------------------------------------------------------------------
 *   Copyright © 2023, SAS Institute Inc., Cary, NC, USA.  All Rights reserved *   Licensed under the Apache License, Version 2.0 (the 'License');
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an 'AS IS' BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 * ---------------------------------------------------------------------------------------
 *
 */

'use strict';

import fs from 'fs';
import restaf from  '@sassoftware/restaf' ;
import restaflib from '@sassoftware/restaflib';
import getLogonPayload from './getLogonPayload.js';

const {initStore} = restaf
const{ casSetup, caslRun} = restaflib;
run()
  .catch(e => {
	console.error(e);
	process.exit(1);
  });

async function run (  ) {
	let store = initStore();
	let logonPayload = await getLogonPayload();
	console.log('logon payload', logonPayload);
	let msg = await store.logon(logonPayload);

	let { session } = await casSetup( store, null);
	let filename = 'cancerscores';
	let fileType = 'csv';
	let outputName = 'cancerscores';

	let csv = readFile( filename, fileType );
	let rc = await restaflib.casUpload(store, session, null, { caslib: 'public', name: outputName }, true, csv);
	
	let p = {
		action: 'table.fetch',
		data  : { table: { caslib: 'public', name: outputName } }
	};

	let actionResult= await store.runAction( session, p );
	console.log(JSON.stringify(actionResult.items( 'tables' ).toJS(), null, 4));
	let t = actionResult.items( 'tables', 'Fetch', 'rows' ).toJS();
	console.log(t[0].length);
	console.log('table', t[0]);

	let src = `
	table.droptable /
      caslib="public" name="cancerscores" quiet=true;
    table.loadTable status=status r=rc/
    caslib="public",
    path="cancerscores.sashdat",
    casout={name="cancerscores", caslib="public" promote=True};
    run;
	
	`;
	rc = await caslRun(store, session, src, {}, true);
	console.log('rc from publish table: ', JSON.stringify(rc, null, 2));

	await store.apiCall( session.links( 'delete' ) );

	return 'done'
};

function readFile ( filename, fileType ) {
  let data = fs.readFileSync( `./data/${filename}.${fileType}` );
  console.log(data);
  console.log((typeof data));
  return data;
}
