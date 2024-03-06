// https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/openai/openai-assistants/README.md
//Notes: this uses openai-assistants not azure/openai directly with client.beta object 
//like openai
// But there are examples working that way in python.
// The doc on openai-assistants is not very clear on how to use it.
// so creating @sassofware/azureai-assistantjs

import  {AssistantsClient, AzureKeyCredential} from '@azure/openai-assistants';
import * as openai from '@azure/openai'

runMain()
.then(() => console.log("Done"))
.catch((err) => console.log(err));

async function runMain() {
  let endpoint = process.env.OPENAI_AZ_ENDPOINT;
  let apiKey = process.env.OPENAI_AZ_KEY;
  console.log({endpoint}, {apiKey});

  const client = new openai.OpenAIClient(
    endpoint,
    new openai.AzureKeyCredential(apiKey)
);  
console.log('client:', client);
let parm ={
  model: process.env.OPENAI_AZ_MODEL,// = deployment  model
  name: "JS Math Tutor",
  instructions: "You are a personal math tutor. Write and run code to answer math questions.",
  tools: [{ type: "code_interpreter" }]
};
const assistant = await client.assistants.create(parm);
  debugger;
  /*
  
  console.log(parm)
  const assistant = await client.createAssistant(parm);
  console.log(assistant);
  uncomment to create threads
  const thread = await client.createThread(assistant.id);
  console.log(thread);
  */
  
  return 'done'
}




