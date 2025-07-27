/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import Redis from 'ioredis';

import restaf from '@sassoftware/restaf';
import restaflib from '@sassoftware/restaflib';
import getLogonPayload from './getLogonPayload.js';
import debug from 'debug';

const log = debug('subscriber');
const redis = new Redis({ host: 'redis', port: 6379 });

let count = 0;
async function main() {


  let logonPayload = await getLogonPayload();
  let store = restaf.initStore({});
  let { _servers, session } = await restaflib.casSetup(store, logonPayload);
  log('session created');

  const appendData = async (csv) => {

    // upload the current data to the CAS table
    let tempTable = { caslib: 'casuser', name: 'testupload' };
    let rc = await restaflib.casUpload(store, session, null, tempTable, true, csv);
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
  table.droptable /
	caslib="Public" name="cancerscores"  quiet=true;

  table.droptable/
	caslib="casuser" name="testupload" quiet=true;

  table.loadTable /
	caslib="casuser" path="testupload.sashdat"
    casout = {caslib="casuser" name="testupload" replace=true};

  table.loadTable /
	caslib="Public" path="cancerscores.sashdat"
    casout = {caslib="Public" name="cancerscores" replace=true};

  table.append /
    source = {caslib="casuser" name="testupload"}
    target= {caslib="Public" name="cancerscores"};

  table.save /
    replace=true
	table = {caslib="Public" name="cancerscores"}	
    caslib="Public" name="cancerscores.sashdat";

  table.droptable /
	caslib="Public" name="cancerscores" ;

  table.loadTable status=status r=rc/
    caslib="public",
    path="cancerscores.sashdat",
    casout={name="cancerscores", caslib="Public" promote=True};
     run;
   send_response({status=status, rc=rc, message='Table promoted successfully'});
      `;
    console.log('src: ', src);
    let frc = await restaflib.caslRun(store, session, src, {}, true);
    console.log('rc from casAppendTable: ', JSON.stringify(frc, null, 2));
    return frc;;
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
    // need to do some cleanup to convert the message to a datastep
    let cols = [];
    let values = [];
    let r1 = message.split(',').reduce((acc, pair) => {
      let [key, value] = pair.split('=');
      cols.push(key);
      if (value === undefined ||value.trim().length === 0) {  //quick patch for empty values
        value = 'none';
      }
      values.push(value);
      acc[key] = value;
      return acc;
    }, {});
    console.log('Received message as JS Object ', r1);
    let csv = cols.join(',') + '\n' + values.join(',');
    console.log('Received message as CSV: ', csv);

    let publishrc = true;
    appendData(csv)
      .then((rc) => {
        publishrc = rc;
        log(`Processed message count: ${count}`);
      })
      .catch(err => {
        console.error('Error processing message: ', err);
        publishrc = err
        return err;
      });

    // create object from message
  });
}

main().catch(err => {
  console.error('Error in main function: ', err.message);
  process.exit(1);
});