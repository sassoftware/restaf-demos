import t from"openai";import{OpenAIClient as a,OpenAIKeyCredential as e}from"@azure/openai";import s from"@sassoftware/restaf";import n from"@sassoftware/restaflib";async function i(t,a,e,s){let n=null;if(!0===s&&"0"!=a)try{n=await t.beta.threads.retrieve(a)}catch(t){console.log(t),console.log(t.status),console.log(`Error status ${t.status}. Unable to retrieve the thread ${thread_id}`)}return null==n&&(console.log("Creating new thread"),n=await t.beta.threads.create({metadata:{assistanceName:e.name}}),e=await t.beta.assistants.update(e.id,{metadata:{thread_id:n.id,lastRunId:"0"}})),{thread:n,assistant:e}}async function o(o){let{provider:r,assistantName:l,credentials:d}=o,u="openai"===r?d.openaiKey:d.azureaiKey,c=d.azureaiEndpoint,h="openai"===r?new t({apiKey:u}):new a(c,new e(u)),m=(await h.beta.assistants.list({order:"desc",limit:"100"})).data.find(t=>{if(t.name===l)return t}),p=null==m?await async function(t,a){let{assistantName:e,instructions:s,model:n,specs:o,reuseThread:r}=a,l={name:e,instructions:s,model:n,tools:o.tools,metadata:{thread_id:"0",lastRunId:"0"}},d=await t.beta.assistants.create(l);console.log("-----------------------------------"),console.log("New Assistant: ",e,d.id);let u=await i(t,a.threadid,d,r);return console.log("Thread ID: ",u.thread.id),console.log("-----------------------------------"),{openai:t,assistant:u.assistant,thread:u.thread,threadid:u.thread.id,specs:o}}(h,o):await async function(t,a,e){let{reuseThread:s}=e;console.log("Using Existing Assistant: ",a.name,a.id);let n=a.metadata.thread_id;"0"!==e.threadid&&(n=e.threadid),console.log("Associated thread_id: ",n);let o=await i(t,n,a,s);return{openai:t,assistant:o.assistant,thread:o.thread,threadid:o.thread.id,specs:e.specs}}(h,m,o);return{gptControl:p,appEnv:await async function(t,a){let e={host:null,logonPayload:null,store:null,session:null,servers:null,casServerName:null,source:t,sessionID:null};if("none"===t||null==t)return e;let i=s.initStore({casProxy:!0});if(await i.logon(a),e={host,logonPayload:a,store:i,source:t},"cas"===t){let{session:t,servers:a}=await n.casSetup(i,null);e.session=t,e.servers=a,e.casServerName=t.links("execute","link","server")}else e.session=await n.computeSetup(i),e.server=null;let o=await i.apiCall(e.session.links("self"));return e.sessionID=o.items("id"),e}(o.source)}}async function r(t,a,e){let s=(await t.beta.threads.messages.list(a.id,{limit:e})).data[0].content[0];return s[s.type].value}async function l(t,a,e){let{openai:s,assistant:n}=e,i=null,o=null;function r(t){return new Promise(a=>setTimeout(a,t))}do{o=await s.beta.threads.runs.retrieve(t.id,a.id),console.log("-------------------",o.status),"queued"!==o.status&&"in_progress"!==o.status&&"cancelling"!==o.status?i=o.status:await r(2e3)}while(null===i);let l=await s.beta.assistants.update(n.id,{metadata:{thread_id:t.id,lastRunId:a.id}});return e.assistant=l,o}async function d(t,a,e){let{openai:s,assistant:n,thread:i}=a,o=null,d=null;try{d=await s.beta.threads.messages.create(i.id,{role:"user",content:t})}catch(t){if(console.log(`status = ${t.status}. Unable to add the prompt to the thread`),console.log("will try to cancel the last run"),console.log(t),400===t.status&&"0"!==n.metadata.lastRunId)try{o=await s.beta.threads.runs.cancel(i.id,n.metadata.lastRunId),n=await s.beta.assistants.update(n.id,{metadata:{thread_id:i.id,lastRunId:o.id}}),a.assistant=n,console.log("Cancelled the last run")}catch(t){console.log("Unable to cancel the last run"),console.log(t)}else await s.beta.threads.del(i.id),i=await s.beta.threads.create({metadata:{assistanceName:n.name,lastRunId:"0"}}),a.thread=i,console.log("Deleted old thread and created a new one")}d=await s.beta.threads.messages.create(i.id,{role:"user",content:t}),o=await s.beta.threads.runs.create(i.id,{assistant_id:n.id,instructions:"Help user use SAS Viya to accomplish a task\n                      Allow users to query for information from a Viya Server.\n                      Allow users to query the retrieved information"});let u=await l(i,o,a);return"completed"===u.status?await r(s,i,1):"requires_action"===u.status?(await async function(t,a,e,s,n){let{openai:i,specs:o}=s,{functionList:r}=o,d=t.required_action.submit_tool_outputs.tool_calls,u=[];for(let t of d){let a=t.function.name;console.log("Requested function: ",a);let e=JSON.parse(t.function.arguments),i=await r[a](e,n,s);u.push({tool_call_id:t.id,output:JSON.stringify(i)})}let c=await i.beta.threads.runs.submitToolOutputs(a.id,e.id,{tool_outputs:u});return await l(a,c,s)}(u,i,o,a,e),await r(s,i,1)):{runStatus:u.status}}async function u(t,a){return!0}export{u as closeAssistant,d as runAssistant,o as setupAssistant};
//# sourceMappingURL=index.modern.js.map
