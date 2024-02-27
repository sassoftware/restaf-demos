async function getLatestMessage(openai,thread, limit) {  
  const messages = await openai.beta.threads.messages.list(thread.id, {limit:limit});
  
  let content = messages.data[0].content[0];
  let message = content[content.type].value;
  return message

}
export default getLatestMessage;