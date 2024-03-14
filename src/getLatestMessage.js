/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @async
 * @description Return the latest message from thread
 * @param {gptControl}  gptControl - client control object
 * @param {number} limit - limit the number of messages to return
 * @returns {promise} - messages - array of latest assistant messages[ {id, role, type, content}]
 * @example - This function will return latest assistant messages based on limit
 */
async function getLatestMessage(gptControl, limit) {  
  let {thread, assistantApi} = gptControl;
  
  const messages = await assistantApi.listMessages(thread.id, {limit:limit});
 
  let output = [];
  let data = messages.data;
  for (let i = 0; i < messages.data.length; i++){
    let content = data[i].content[0];
    if (data[i].role === 'assistant') {
      output.push({id: data[i].id, role: data[i].role, type: content.type, content: content[content.type].value});
    } else {
      break;
    }
  }
  if (output.length > 1) {
    output = output.reverse();
  }
  return output;

}
export default getLatestMessage;