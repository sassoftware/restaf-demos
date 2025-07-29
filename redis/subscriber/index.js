/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import Redis from 'ioredis';

import restaf from '@sassoftware/restaf';
import restaflib from '@sassoftware/restaflib';
import getLogonPayload from './getLogonPayload.js';
import appendData from './appendData.js';
import debug from 'debug';



async function main() {

  // setup
  const log = debug('subscriber');
  const redis = new Redis({ host: 'redis', port: 6379 });
  let count = 0;
  let logonPayload = await getLogonPayload();
  let store = restaf.initStore({});
  let { _servers, session } = await restaflib.casSetup(store, logonPayload);
  log('session created');

  // subscribe to the Redis channel
  redis.subscribe(process.env.REDIS_CHANNEL, (err, count) => {
    if (err) {
      console.error('Failed to subscribe: ', err.message);
      return;
    }
    console.log(`Subscribed successfully! This client is currently subscribed to ${count} channels.`);
  });

  // Read the messages on the subscribed channel
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
      if (value === undefined || value.trim().length === 0) {  //quick patch for empty values
        value = 'none';
      }
      values.push(value);
      acc[key] = value;
      return acc;
    }, {}); 
    console.log('Received message as JS Object ', r1);
    console.log('no of cols: ', cols.length, ' values: ', values.length);
    console.log('mo of values: ', values.length);
    let csv = cols.join(',') + '\n' + values.join(',');
    console.log('Received message as CSV: ', csv);

    let publishrc = true;
    console.log(appendData);
    appendData(store, session, csv)
      .then((rc) => {
        publishrc = rc;
        log(`Processed message count: ${count}`);
        return publishrc;
      })
      .catch(err => {
        console.error('Error processing message: ', JSON.stringify(err, null,4));
        publishrc = err;
        return err;
      });

    // create object from message
  });
}

main().catch(err => {
  console.error('Error in main function: ', err.message);
  process.exit(1);
});