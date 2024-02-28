/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * 
 * @description Return the latest message from thread
 * @param {object}  openai - openai object
 * @param {object} thread - active thread
 * @param {number} limit - limit the number of messages to return
 * @returns {*} - message
 */
async function getLatestMessage(openai,thread, limit) {  
  const messages = await openai.beta.threads.messages.list(thread.id, {limit:limit});
  
  let content = messages.data[0].content[0];
  let message = content[content.type].value;
  return message

}
export default getLatestMessage;