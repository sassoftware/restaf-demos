import  {OpenAIClient, OpenAIKeyCredential} from '@azure/openai';
const client = new OpenAIClient(endpoint, new OpenAIKeyCredential(apiKey));

The following call works when using openai assistant. But with azureai client  
does not have client.beta. I was hoping that the client api will be the same between openai and azureai, so that I can reuse the code.

const myAssistants = await client.beta.assistants.list({
  order: "desc",
  limit: "100",
})