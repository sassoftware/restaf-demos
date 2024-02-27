# CLI to experiment with openai Assistant API and SAS Viya

## Data Points<a name="datapoint"></a>

---

### Requirements

1. Make sure the node version is >=18.0.0
2. gpt-4-turbo model is the default openai model..
3. It is the user's reponsibility to get the api key for openai.
   The following environment variables are read.
    - If provider is openai:
       - openaiKey: process.env.OPENAI_KEY,

    - If provider is azureai:
      - azureaiKey: process.env.OPENAI_AZ_KEY,
      - azureaiEndpoint: process.env.OPENAI_AZ_ENDPOINT

4. Most examples useSAS REST API to access SAS Viya. The applications
use @sassoftware/restaf, @sassoftware/restaflib and @sassoftware/restafedit to
make these calls. See <https://sassoftware.github.io/restaf/>
for more information.

5. The source code in this repository is provided under
 Apache-2.0 licensing model

### Authentication

Please sas-cli auth login|logCode to setup authentication token.
The cli will look for authentication tokens at the standard place (~/.sas)

Authentication is not performed if Viya Server is set to none. 

## CLI

### Command

```cmd

npx @sassoftware/gpt-samples 

```

User will be prompted for information.

Below is a typical prompt sequence

```text

Setup session. CTRL C to exit
? Provider(azureai not ready for primetime) openai
? Assistant name? (default: SAS_ASSISTANT) SAS_ASSISTANT
? Model? (default: gpt-4-turbo-preview) gpt-4-turbo-preview
? Reuse previous thread?(true/false) true
? Viya server: none, cas, compute none
answers {
  provider: 'openai',
  assistantName: 'SAS_ASSISTANT',
  model: 'gpt-4-turbo-preview',
  reuseThread: true,
  source: 'none'
}
Using Existing Assistant:  SAS_ASSISTANT asst_nd6a4f4z78OTSTxxXqViIWTT
Associated thread_id:  thread_YpBGqqx46Tzs9Uxq0RoFynPW
```

### Prompt session

Once the setup is completed, user's can enter prompts and get responses.
