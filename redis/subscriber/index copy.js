/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import Redis from 'ioredis';
import restafedit from '@sassoftware/restafedit';
import getLogonPayload  from './getLogonPayload.js';
import debug from 'debug';  

const log = debug('subscriber');
const redis = new Redis({host: 'redis', port: 6379});
async function main() {

  let logonPayload = await getLogonPayload();
  let config = {
    source: 'cas',
    table: {
      caslib: process.env.CAS_LIB,
      name: process.env.CAS_TABLE
    },
    initialFetch: {
      qs: {
        start: 0, // Adjust for 0-based index
        limit: 1,
        format: false,
        where: ''
      }
    }
  };
  let appControl = await restafedit.setup(
      logonPayload,
      config,
      null,/* create a sessiion */
      {},
      'user',
      {}
    );
  
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
    
    // create object from message
    log(`Received message from channel: ${channel}: ${message}`);
    let data = message.split(',').reduce((acc, pair) => {
          let [key, value] = pair.split('=');
          let v = parseFloat(value);
          acc[key.trim()] = (isNaN(v)) ? value : v;
          return acc;
        }, {});
      
    log('Received message as JS Object ', data);
    //
    // TBD: Process the data as needed and write to SAS for further analysis
    //
    let table = {caslib: process.env.CAS_LIB , name: process.env.CAS_TABLE};
    console.log(`Appending data to table`, JSON.stringify(table));
    restafedit.addRows([data],appControl, true)
    .then (r => {
      console.log('Data appended successfully and saved: ', r);
    })
    .catch(err => {
      console.error('Error appending data: ', err.message);
    });

  });
}

main().catch(err => { 
  console.error('Error in main function: ', err.message);
  process.exit(1);
});