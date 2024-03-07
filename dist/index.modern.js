import t from"openai";async function e(e){let{credentials:a}=e,{key:s}=a,n=new t({apiKey:s,dangerouslyAllowBrowser:!0}),i={provider:"openai",client:n,assistant:null,thread:null,threadid:null,specs:e.domainTools,appEnv:null,config:e};return i.assistant=await async function(t,e){let{assistantName:a,assistantid:s,instructions:n,model:i,domainTools:o}=e,l={name:a,instructions:n,model:i};null!=o.tools&&(l.tools=o.tools);let r=null;return console.log(s),0==("0"===s||null==s)?r=await t.beta.assistants.retrieve(s):null!=a&&(r=(await t.beta.assistants.list({order:"desc",limit:"100"})).data.find(t=>{if(t.name===a)return t}),null==r&&(r=await t.beta.assistants.create(l))),r}(n,e),i.thread=await async function(t,e){let{threadid:a}=e,s=null;try{s="0"===a?await t.beta.threads.create({metadata:{assistantName:assistant.name}}):await t.beta.threads.retrieve(a)}catch(t){throw console.log(t),console.log(t.status),new Error(`Error status ${t.status}. Unable to retrieve the thread ${a}. see console for details.`)}return s}(n,e),i.threadid=i.thread.id,i}async function a(t,e){let{client:a,thread:s}=t;const n=await a.beta.threads.messages.list(s.id,{limit:e});let i=[],o=n.data;for(let t=0;t<n.data.length;t++){let e=o[t].content[0];if("assistant"!==o[t].role)break;i.push({id:o[t].id,role:o[t].role,type:e.type,content:e[e.type].value})}return i.length>1&&(i=i.reverse()),i}async function s(t,e,a){let{client:s}=a,n=null,i=null;function o(t){return new Promise(e=>setTimeout(e,t))}do{i=await s.beta.threads.runs.retrieve(t.id,e.id),console.log("-------------------",i.status),"queued"!==i.status&&"in_progress"!==i.status&&"cancelling"!==i.status?n=i.status:(await o(2e3),console.log("waited 2000 ms"))}while(null===n);return i}async function n(t,e,n,i){let{client:o,thread:l}=t;try{await o.beta.threads.messages.create(l.id,{role:"user",content:e});let r=await async function(t,e,n){let i,{client:o,assistant:l,thread:r}=t,u={assistant_id:l.id,instructions:null!=n?n:""},c=await o.beta.threads.runs.create(r.id,u),d=await s(r,c,t);return"completed"===d.status?i=await a(t,5):"requires_action"===d.status?(await async function(t,e,a,n,i){let{client:o,specs:l}=n,{functionList:r}=l,u=t.required_action.submit_tool_outputs.tool_calls,c=[];for(let t of u){let e=t.function.name;console.log("Requested function: ",e);let a=JSON.parse(t.function.arguments),s=await r[e](a,i,n);c.push({tool_call_id:t.id,output:JSON.stringify(s)})}let d=await o.beta.threads.runs.submitToolOutputs(e.id,a.id,{tool_outputs:c});return await s(e,d,n)}(d,r,c,t,e),i=await a(t,5)):i=[{runStatus:d.status}],i}(t,i,n);return r}catch(t){throw console.log(`status = ${t.status}. Unable to add the prompt to the thread`),console.log(t),new Error("Unable to add the prompt to the thread. See console for more details")}}async function i(t,e){return console.log("in closeAssistant"),!0}async function o(t,e){let{client:a,thread:s}=t;return(await a.beta.threads.messages.list(s.id,{limit:e})).data.map(t=>{let e=t.content[0];return{id:t.id,role:t.role,type:e.type,content:e[e.type].value}})}async function l(t,e,a){let{client:s,assistant:n}=a;const i=await s.files.create({file:t,purpose:e});console.log(".......................",i);let o=[].concat(n.file_ids);o.push(i.id),console.log(o);try{let t=await s.beta.assistants.update(n.id,{file_ids:o});a.assistant=t,console.log(".......................",t)}catch(t){console.log(t)}return o}export{i as closeAssistant,a as getLatestMessage,o as getMessages,n as runAssistant,e as setupAssistant,l as uploadFile};
//# sourceMappingURL=index.modern.js.map
