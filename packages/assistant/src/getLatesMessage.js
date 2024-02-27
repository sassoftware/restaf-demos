/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
async function getLatestMessage(openai,thread, limit) {  
  const messages = await openai.beta.threads.messages.list(thread.id, {limit:limit});
  debugger;
  let content = messages.data[0].content[0];
  let message = content[content.type].value;
  return message

}
export default getLatestMessage;