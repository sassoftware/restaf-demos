/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import Redis from 'ioredis';
import appendData from './appendData.js';
import debug from 'debug';

async function main() {

  // setup redis connection and subscribe to the channel
  const log = debug('subscriber');
  const redis = new Redis({ host: 'redis', port: 6379 });
  let count = 0;
  redis.subscribe(process.env.REDIS_CHANNEL, (err, count) => {
    if (err) {
      console.error('Failed to subscribe: ', err.message);
      return;
    }
    console.log(`Subscribed successfully! This client is currently subscribed to ${process.env.REDIS_CHANNEL} channel.`);
  });

  // Read the messages on the subscribed channel and update master table
  redis.on('message', (channel, message) => {
    if (channel !== process.env.REDIS_CHANNEL) {
      return 0;
    }
  
    console.log(`Received message from channel: ${channel}`);
    console.log(`Message: ${message}`);
  
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
    console.log('No of cols: ', cols.length, ' values: ', values.length);
    console.log('No of values: ', values.length);
    let csv = cols.join(',') + '\n' + values.join(',');
    console.log('Received message as CSV: ', csv);

    let publishrc = true;

    // ready to append the data to the master table
    appendData(csv)
      .then((rc) => {
        publishrc = rc;
        log(`Processed message count: ${count}`);
        return 1;
      })
      .catch(err => {
        console.error('Error processing message: ', JSON.stringify(err, null,4));
        publishrc = err;
        return 1;
      });

    // create object from message
  });
}

main().catch(err => {
  console.error('Error in main function: ', err.message);
  process.exit(1);
});