/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import restaf from '@sassoftware/restaf';
import restaflib from '@sassoftware/restaflib';
import getLogonPayload from './getLogonPayload.js';

let debug = require('debug');
async function appendData(csv) {
    let log = debug('appendData');
  
    let count = 0;
    let logonPayload = await getLogonPayload();
    let store = restaf.initStore({});
    let { _servers, session } = await restaflib.casSetup(store, logonPayload);
    log('session created');
// upload the current data to the CAS table
    let tempTable = { caslib: 'casuser', name: 'testupload' };
    let rc = await restaflib.casUpload(store, session, null, tempTable, true, csv);
    log('=============================================');
    log('rc from casUpload: ', JSON.stringify(rc.items(), null, 2));
    log('=============================================');

    // append the temporary table to the master table
    
    let mlib = process.env.CAS_LIB;
    let mtable = process.env.CAS_TABLE;
  
    let src = `
  /* clear the deck */
  table.droptable /
      caslib="${mlib}" name="${mtable}" quiet=true;
  table.droptable /
      caslib="casuser" name="testupload" quiet=true;

  /* load the temporary table and master table */
  table.loadTable /
      caslib="casuser" path="testupload.sashdat"
    casout = {caslib="casuser" name="testupload" replace=true};
  table.loadTable /
    caslib="${mlib}" path="${mtable}.sashdat"
    casout = {caslib="${mlib}" name="${mtable}" replace=true};

  /* append the temporary table to the master table */
  table.append /
    source = {caslib="casuser" name="testupload"}
    target= {caslib="${mlib}" name="${mtable}"};

  /* save the master table  */
  table.save /
    replace=true
      table = {caslib="${mlib}" name="${mtable}"}
    caslib="${mlib}" name="${mtable}.sashdat";

  /* clean up before promoting the table */
  table.droptable /
      caslib="${mlib}" name="${mtable}" ;

  /* promote the table to make it available for further analysis */
  table.loadTable status=status r=rc/
    caslib="${mlib}",
    path="${mtable}.sashdat",
    casout={name="${mtable}", caslib="${mlib}" promote=True};
    run;

  send_response({status=status, rc=rc, message='Table promoted successfully'});
      `;
    console.log('src: ', src);
    let frc = await restaflib.caslRun(store, session, src, {}, true);
    console.log('rc from casAppendTable: ', JSON.stringify(frc, null, 2));
    await store.apiCall( session.links( 'delete' ) );
    store.logoff();
    return frc;
  }

export default appendData;