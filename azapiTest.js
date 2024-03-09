// https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/openai/openai-assistants/README.md
//Notes: this uses openai-assistants not azure/openai directly with client.beta object 
//like openai
// But there are examples working that way in python.
// The doc on openai-assistants is not very clear on how to use it.
// so creating @sassofware/azureai-assistantjs

import  {AssistantsClient, AzureKeyCredential} from '@azure/openai-assistants';

runMain()
.then(() => console.log("Done"))
.catch((err) => console.log(err));

async function runMain() {
  let endpoint = process.env.OPENAI_AZ_ENDPOINT;
  let apiKey = process.env.OPENAI_AZ_KEY;
  console.log({endpoint}, {apiKey});

  const client = new AssistantsClient(
    endpoint,
    new AzureKeyCredential(apiKey)
);  
  debugger;
  let parm ={
    model: process.env.OPENAI_AZ_MODEL,// = deployment  model
    name: "JS Math Tutor",
    instructions: "You are a personal math tutor. Write and run code to answer math questions.",
    tools: [{ type: "code_interpreter" }]
  };
  console.log(parm);
  let x = client.createAssistant;
  const assistant = await x(parm);
  console.log(assistant);
  // let s = await client.getAssistant(xxx)
  let s = await client.listAssistants();
  console.log('s', s);
  /* uncomment to create threads
  const thread = await client.createThread(assistant.id);
  console.log(thread);
  */
  
  return 'done'
}



