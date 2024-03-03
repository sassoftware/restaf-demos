import t from"openai";import{OpenAIClient as e,OpenAIKeyCredential as a}from"@azure/openai";async function n(n){let{provider:s,credentials:i}=n,{openaiKey:o,azureaiKey:r,azureaiEndpoint:l}=i,u=null;if("openai"===s){if(null==o)throw new Error("Missing OpenAI API Key");u=new t({apiKey:o,dangerouslyAllowBrowser:!0})}else{if("azureai"!==s)throw new Error("Invalid provider. Must be openai or azureai.");if(null==r)throw new Error("Missing Azure API Key");if(null==l)throw new Error("Missing Azure Endpoint");u=new e(endpoint,new a(r)),console.log(Object.keys(u))}let c={client:u,assistant:null,thread:null,threadid:null,specs:n.domainTools,appEnv:null,config:n};return c.assistant=await async function(t,e){let{assistantName:a,assistantid:n,instructions:s,model:i,domainTools:o}=e,r={name:a,instructions:s,model:i};null!=o.tools&&(r.tools=o.tools);let l=null;return console.log(n),"0"!==n?l=await t.beta.assistants.retrieve(n):(l=(await t.beta.assistants.list({order:"desc",limit:"100"})).data.find(t=>{if(t.name===a)return t}),null==l&&(l=await t.beta.assistants.create(r))),l}(u,n),c.thread=await async function(t,e){let{threadid:a}=e,n=null;try{n="0"===a?await t.beta.threads.create({metadata:{assistantName:assistant.name}}):await t.beta.threads.retrieve(a)}catch(t){throw console.log(t),console.log(t.status),new Error(`Error status ${t.status}. Unable to retrieve the thread ${a}. see console for details.`)}return n}(u,n),c.threadid=c.thread.id,c}async function s(t,e){let{client:a,thread:n}=t;const s=await a.beta.threads.messages.list(n.id,{limit:e});let i=[],o=s.data;for(let t=0;t<s.data.length;t++){let e=o[t].content[0];if("assistant"!==o[t].role)break;i.push({id:o[t].id,role:o[t].role,type:e.type,content:e[e.type].value})}return i.length>1&&(i=i.reverse()),i}async function i(t,e,a){let{client:n}=a,s=null,i=null;function o(t){return new Promise(e=>setTimeout(e,t))}do{i=await n.beta.threads.runs.retrieve(t.id,e.id),console.log("-------------------",i.status),"queued"!==i.status&&"in_progress"!==i.status&&"cancelling"!==i.status?s=i.status:(await o(2e3),console.log("waited 2000 ms"))}while(null===s);return i}async function o(t,e,a,n){let{client:o,thread:r}=t;try{await o.beta.threads.messages.create(r.id,{role:"user",content:e});let l=await async function(t,e,a){let n,{client:o,assistant:r,thread:l}=t,u={assistant_id:r.id,instructions:null!=a?a:""},c=await o.beta.threads.runs.create(l.id,u),d=await i(l,c,t);return"completed"===d.status?n=await s(t,5):"requires_action"===d.status?(await async function(t,e,a,n,s){let{client:o,specs:r}=n,{functionList:l}=r,u=t.required_action.submit_tool_outputs.tool_calls,c=[];for(let t of u){let e=t.function.name;console.log("Requested function: ",e);let a=JSON.parse(t.function.arguments),i=await l[e](a,s,n);c.push({tool_call_id:t.id,output:JSON.stringify(i)})}let d=await o.beta.threads.runs.submitToolOutputs(e.id,a.id,{tool_outputs:c});return await i(e,d,n)}(d,l,c,t,e),n=await s(t,5)):n=[{runStatus:d.status}],n}(t,n,a);return l}catch(t){throw console.log(`status = ${t.status}. Unable to add the prompt to the thread`),console.log(t),new Error("Unable to add the prompt to the thread. See console for more details")}}async function r(t,e){return console.log("in closeAssistant"),!0}async function l(t,e){let{client:a,thread:n}=t;return(await a.beta.threads.messages.list(n.id,{limit:e})).data.map(t=>{let e=t.content[0];return{id:t.id,role:t.role,type:e.type,content:e[e.type].value}})}export{r as closeAssistant,s as getLatestMessage,l as getMessages,o as runAssistant,n as setupAssistant};
//# sourceMappingURL=index.modern.js.map
