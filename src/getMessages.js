/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * 
 * @description Return sepcified number of messages from thread
 * @private
 * @param {object}  gptControl- client control object
 * @param {number} limit - limit the number of messages to return
 * @returns {*} - messages - array of messages[ {id, role, type, content}]
 * @example - This function will return the specified number of messages from the thread
 * Typically the top 2 will be the assistant message and user's prompt
 */
async function getMessages(gptControl, limit) {  
  let {thread, assistantApi} = gptControl;
  const messages = await assistantApi.listMessages(thread.id, {limit:limit});
  //console.log('body', JSON.stringify(messages.body.data, null, 4));
  let output = messages.data.map((m) => {
    let content = m.content[0];
    return {id: m.id, role: m.role, type: content.type, content: content[content.type].value};
  });
  return output;

}
export default getMessages;