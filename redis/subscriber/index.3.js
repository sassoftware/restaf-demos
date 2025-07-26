/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import Redis from 'ioredis';

import restaf from '@sassoftware/restaf';
import restaflib from '@sassoftware/restaflib';
import getLogonPayload  from './getLogonPayload.js';
import debug from 'debug';  

const log = debug('subscriber');
const redis = new Redis({host: 'redis', port: 6379});

let count = 0;
async function main() {


  let logonPayload = await getLogonPayload();
  let store = restaf.initStore({});
  let {_servers, session} = await restaflib.casSetup(store, logonPayload);
  log('session created'); 

  const appendData = async (csv) => {

    // upload the current data to the CAS table
    let tempTable = {caslib: 'casuser', name: 'testupload'};
    let rc = await restaflib.casUpload(store, session,null,tempTable, true,csv);
    console.log('=============================================');
    console.log('rc from casUpload: ', JSON.stringify(rc.items(), null, 2));
    console.log('=============================================');

    // append the temporary table to the master table
    //let masterTable = {caslib: process.env.CAS_LIB, name: process.env.CAS_TABLE};
    let masterTable = process.env.CAS_LIB + '.' + process.env.CAS_TABLE;
    let source = tempTable.caslib + '.' + tempTable.name;
    //not efficient but allows the demo to use VA to see the data
    let src = `
  /* clear the deck */
  action table.droptable/
      caslib="${process.env.CAS_LIB}" name="${process.env.CAS_TABLE}" quiet=True;
  action table.droptable/
      caslib="casuser" name="${process.env.CAS_TABLE}" quiet=True;
  action table.droptable/
      caslib="casuser" name="testupload" quiet=True;

  /* load the tables into casuser */
  action table.loadTable r = result2 /
      caslib='casuser' casout={caslib='casuser' name='testupload' replace=true} 
      path='testupload.sashdat' ;
  action table.loadTable r = result2 /
      caslib='casuser' casout={caslib='casuser' name="${process.env.CAS_TABLE}" replace=true} 
      path='${process.env.CAS_TABLE}.sashdat' ;

  /* append table */

  action table.append r = result /
        source={caslib='casuser' name='testupload'}
        target={caslib='casuser' name='${process.env.CAS_TABLE}'};

  /* save the new data */
  action table.save /
      table = {caslib= 'casuser', name='${process.env.CAS_TABLE}'}
      caslib='casuser' name='${process.env.CAS_TABLE}.sashdat' replace=True;

  /* load the new table into casuser */
  action table.loadTable r = result2 /
      caslib='casuser' casout={caslib='casuser' name='${process.env.CAS_TABLE}' replace=true} 
      path='${process.env.CAS_TABLE}.sashdat' ;

  /* now promote it to ${process.env.CAS_LIB} with new name */

  table.promote r=rcp/
      caslib='casuser'
      name='${process.env.CAS_TABLE}'
      drop=true
      quiet=true
      target='${process.env.CAS_TABLE}'
      targetlib='${process.env.CAS_LIB}';
      send_response({status=rcp});
      `;
    console.log('src: ', src);
     rc = await restaflib.caslRun(store, session, src, {}, true);
    // rc = await restaflib.casAppendTable(store, session, tempTable, masterTable, true);
    console.log('rc from casAppendTable: ', JSON.stringify(rc, null, 2));
    return true;
  }
  
  redis.subscribe(process.env.REDIS_CHANNEL, (err, count) => {
    if (err) {
      console.error('Failed to subscribe: ', err.message);
      return;
    }
    console.log(`Subscribed successfully! This client is currently subscribed to ${count} channels.`);
  });

  // Listen for messages on the subscribed channel
  redis.on('message', (channel, message) => {
    if (channel !== process.env.REDIS_CHANNEL) {
      return;
    }
    log(`Received message from channel: ${channel}: ${message}`);
    console.log(typeof message, ' message type');
    let m = message.replace(/[\[\]']+/g, '');
    let lines = m.split('\n');
    let csv = [];
    let headers = lines[0].split(',');
    csv.push(headers);
    let data = lines.slice(1).map(line => line.split(','));
    csv.push(data)
      
    console.log(csv.length, ' rows received');
    console.log('Received message as CSV: ', csv);
    
    appendData(csv)
    .then (() => {
      log(`Processed message count: ${count}`);
    })
    .catch(err => {
      console.error('Error processing message: ', err.message);
    });
    
    // create object from message
  });
}

main().catch(err => { 
  console.error('Error in main function: ', err.message);
  process.exit(1);
});