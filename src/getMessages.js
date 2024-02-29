/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * 
 * @description Return sepcified number of messagesfrom thread
 * @param {object}  gptControl- openai control object
 * @param {number} limit - limit the number of messages to return
 * @returns {*} - messages - array of messages
 */
async function getMessages(gptControl, limit) {  
  let {openai, thread} = gptControl;
  const messages = await openai.beta.threads.messages.list(thread.id, {limit:limit});
  //console.log('body', JSON.stringify(messages.body.data, null, 4));
  let output = messages.data.map((m) => {
    let content = m.content[0];
    return {id: m.id, role: m.role, type: content.type, content: content[content.type].value};
  });
  return output;

}
export default getMessages;