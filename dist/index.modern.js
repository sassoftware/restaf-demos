import t from"openai";import{AssistantsClient as e,AzureKeyCredential as s}from"@azure/openai-assistants";import a from"@sassoftware/restaf";import r from"@sassoftware/restaflib";import n from"@sassoftware/restafedit";function i(t,e){let s={},a="cas"===e?"caslib":"libref",r=t.split(".");return 2===r.length?(s[a]=r[0],s.name=r[1],s):null}function o(t){if(0===t.length)return"";let e=Object.keys(t[0]).join(",")+"\n",s="";return t.map(t=>{let e="",a="";Object.values(t).map(t=>{e=e+a+function(t){let e;return e="."==t||null==t?"":"string"==typeof t?(t=t.replace(/"/g,'""')).trim():t.toString(),e}(t),a=","}),s=s+e+"\n"}),e+s}async function l(t,e){let{resource:s,limit:a}=t,r=e.store;if(a=null==a?10:a,!1===["files","folders","reports"].includes(s.toLowerCase()))return`{Error: "resource ${s} is not supported at this time"}`;let n=(await r.addServices(s))[s],i={qs:{limit:a,start:0}},o=(await r.apiCall(n.links(s),i)).itemsList().toJS();return JSON.stringify(o)}async function u(t,e){let{limit:s,start:a}=t,r={qs:{limit:null==s?10:s,start:null==a?0:a}},n=await e.restafedit.getLibraryList(e,r);return JSON.stringify(n)}async function c(t,e){let{library:s,limit:a}=t,r={qs:{limit:null==a?10:a,start:0}},n=await e.restafedit.getTableList(s,e,r);return JSON.stringify(n)}async function d(t,e){let{table:s}=t,{source:a}=e;if(null===i(s,a))return"Table must be specified in the form casuser.cars or sashelp.cars";let r=await e.restafedit.getTableList(library,e,p);return JSON.stringify(r)}async function f(t,e){let s=await b(t,e);return JSON.stringify({table:s.table,data:s.data})}async function m(t,e,s){let{program:a}=t,{store:r,session:n,restaflib:i}=e,o=`send_response({casResults={result="${o}"}})`;console.log("src",o);try{if("cas"===e.source){let t=await i.caslRun(r,n,o,{},!0);return console.log(JSON.stringify(t.results)),JSON.stringify(t.results)}if(e){let t=await computeRun(r,n,o);return function(t){let e=[];return t.map(t=>{let s=t.line.replace(/(\r\n|\n|\r)/gm,"");e.push(0===s.length?"   ":s)}),e}(await i.computeResults(r,t,"log"))}return"Cannot run program without a session"}catch(t){return console.log(t),"Error running program "+a}}async function h(t){let{keywords:e,format:s}=t;switch(console.log("keywords",e,s),s){case"html":{let t="<ul>";return e.split(",").forEach(e=>{t+=`<li>${e}</li>`}),t+="</ul>",t}case"array":return e.split(",");case"object":{let t={};return e.split(",").forEach((e,s)=>{t[`key${s}`]=e}),t}default:return t}}async function g(t,e){let s=await b(t,e);return JSON.stringify(s)}async function b(t,e){let{table:s,limit:a,format:r,where:n,csv:l}=t,{source:u,sessionID:c,restafedit:d}=e;l=null!=l&&l,console.log(t);let p=i(s,u);if(null===p)return"Table must be specified in the form casuser.cars or sashelp.cars";let f={source:u,table:p,casServerName:e.casServerName,computeContext:e.computeContext,initialFetch:{qs:{start:0,limit:null==a?2:a,format:null!=r&&r,where:null==n?"":n}}},m=await d.setup(e.logonPayload,f,c),h={};try{await d.scrollTable("first",m),h={table:p,tableSummary:await d.getTableSummary(m),columns:m.state.columns,data:!1===l?m.state.data:o(m.state.data)}}catch(t){console.log(t),h={error:t}}return h}const y={name:"_getData",description:"Fetch data from a  table like casuser.cars.\n                To limit the number of rows, specify the limit parameter.\n                If format is true, then the data will be formatted.\n                Use standard where clause to filter the data.\n                To return data in csv format, specify csv = true. Default is false.",parameters:{properties:{table:{type:"string",description:"The table to setup. The form of the table is casuser.cars"},limit:{type:"integer",description:"Fetch only the specified number of rows"},format:{type:"boolean",description:"Format the string - true or false"},where:{type:"string",description:'A where clause like Make eq "Audi"'},csv:{type:"boolean",description:"Return data in csv format - true or false"}},type:"object",required:["table"]}},w={name:"_listSASObjects",description:"list SAS resources like reports, files, folders. Specify the limit parameter to limit the number of items returned",parameters:{properties:{resource:{type:"string",description:"The objecttable to setup. The form of the table is casuser.cars"},limit:{type:"integer",description:"Get this many items"}},type:"object",required:["resource","limit"]}},S={name:"_listSASDataLib",description:"list available SAS libs, calibs, librefs.\n     A example would be list libs. \n     If limit is not is specified, then the function \n     will return the first 10 libs.\n     Optionally allow user to specify the source as cas or compute.",parameters:{properties:{limit:{type:"integer",description:"Return only this many libs. If not specified, then return 10 libs."},source:{type:"string",description:"The source of the data. cas or compute",enum:["cas","compute"]}},type:"object"}},A={name:"_listSASTables",description:"for a given library, lib or caslibs get the list of available tables\n    (ex: list tables for Samples)\n    Optionally let user specify the source as cas or compute.",parameters:{properties:{library:{type:"string",description:"A SAS library like casuser, sashelp, samples"},limit:{type:"integer",description:"Return only this many tables. If not specified, then return 10 tables."},source:{type:"string",description:"The source of the data. cas or compute",enum:["cas","compute"]}},type:"object",required:["library"]}},v={name:"_listColumns",description:"Get schema or columns for specified table. Table is of the form sashelp.cars",parameters:{properties:{table:{type:"string",description:"A table like sashelp.cars"}},type:"object",required:["table"]}},T={name:"_describeTable",description:"Describe the table like sashelp.cars . return information on the table like columns, types, keys. Optionally format the data",parameters:{properties:{table:{type:"string",description:"A table like sashelp.cars"},format:{type:"boolean",description:"If true then format the data"}},type:"object",required:["table"]}},k={name:"_runSAS",description:"run the specified sas program",parameters:{properties:{program:{type:"string",description:"this is the program to run"}},type:"object",required:["program"]}},_={name:"_keywords",description:"format a comma-separated keywords like a,b,c into html, array, object",parameters:{properties:{keywords:{type:"string",description:"A comma-separated list of keywords like a,b,c"},format:{type:"string",enum:["html","array","object"],description:"Format the string"}},type:"object",required:["keywords","format"]}};function E(t,e){let s=t;return"openai"===e&&(s={listAssistants:(t=>(...e)=>{let[s]=e;return t.beta.assistants.list(s)})(t),createAssistant:(t=>(...e)=>{let[s]=e;return t.beta.assistants.create(s)})(t),getAssistant:(t=>(...e)=>{let[s]=e;return t.beta.assistants.retrieve(s)})(t),deleteAssistant:(t=>(...e)=>{let[s]=e;return t.beta.assistants.del(s)})(t),updateAssistant:(t=>(...e)=>{let[s,a]=e;return a.fileIds&&(a.file_ids=a.fileIds,delete a.fileIds),t.beta.assistants.update(s,a)})(t),createThread:(t=>(...e)=>{let[s]=e;return null==s&&(s={}),t.beta.threads.create(s)})(t),getThread:(t=>(...e)=>{let[s]=e;return t.beta.threads.retrieve(s)})(t),deleteThread:(t=>(...e)=>{let[s]=e;return t.beta.threads.del(s)})(t),createMessage:(t=>(...e)=>{let[s,a,r]=e;return t.beta.threads.messages.create(s,{role:a,content:r})})(t),listMessages:(t=>(...e)=>{let[s,a]=e;return t.beta.threads.messages.list(s,a)})(t),uploadFile:(t=>(...e)=>{let[s,a]=e;return t.files.create({file:s,purpose:a})})(t),createRun:(t=>(...e)=>{let[s,a]=e;return t.beta.threads.runs.create(s,{assistant_id:a.assistantId,additional_instructions:a.instructions})})(t),getRun:(t=>(...e)=>{let[s,a]=e;return t.beta.threads.runs.retrieve(s,a)})(t),listRuns:(t=>(...e)=>{let[s]=e;return t.beta.threads.runs.list(s)})(t),cancelRun:(t=>(...e)=>{let[s,a]=e;return t.beta.threads.runs.cancel(s,a)})(t),submitToolOutputsToRun:(t=>(...e)=>{let[s,a,r]=e;return t.beta.threads.runs.submitToolOutputs(s,a,r)})(t)}),s}async function O(i){let{credentials:o}=i,{key:p,endPoint:b}=o,O=null;O="openai"===i.provider?new t({apiKey:p,dangerouslyAllowBrowser:!0}):new e(b,new s(p,{}));let N=function(t,e,s){let a=[w,S,A,v,T,y,k,_],r=[];a.forEach(t=>{let e={type:"function",function:Object.assign({},t)};r.push(e)});let n={_getData:f,_listSASObjects:l,_listSASTables:c,_listColumns:d,_listSASDataLib:u,_runSAS:m,_keywords:h,_describeTable:g},i="undefined"==typeof window?(console.log("instructions for node use "),"\n You are a Assistant designed for SAS users. You can help SAS users with their SAS related questions and provide information\n  on topics like libraries, reports, tables. You can also fetch data from tables and run SAS programs. You can also help answer questions about the \n  data that has been returned from previous queries.\n  "):(console.log("instructions for web"),"\n You are a Assistant designed for SAS users. You can help SAS users with their SAS related questions and provide information\n  on topics like libraries, reports, tables. You can also fetch data from tables and run SAS programs. You can also help answer questions about the \n  data that has been returned from previous queries.\n\n  Here are some tips for formatting the response from the tools when running on a browser.\n  For example,\n  If the response from a tool is of the form [{a:1,b:2},{a:1,b:3},...] format the table as a html table element like this\n  '<table>\n     <tr>\n       <th>a</th> \n      <th>b</th>\n     </tr>\n    <tr>\n    <td>1</td>\n    <td>2</td>\n    </tr>\n    <tr>\n   <td>2</td>\n   <td>3</td>\n   </tr>\n   </table>' \n  Use a style of your choice to make the table look good with solid borders and a background color of lightblue for the column headers.\n\n\n  if the response from a tool is of the form [1,2,3] then return the data as a html unordered list to the user\n  like this:\n  '<ul>\n    <li>1</li>\n    <li>2</li>\n    <li>3</li>\n  </ul>'\n\n  if the response from a tool is of the form {a:1,b:2} then return the data as a html definition list to the user\n  like this:\n  '<dl>\n    <dt>a</dt>\n    <dd>1</dd>\n    <dt>b</dt>\n    <dd>2</dd>\n  </dl>'\n  \n  You can also allow users to attach files to the assistant. \n\n  ");return{specs:a,tools:r,functionList:n,instructions:i}}(),R={};R=!0===i.domainTools.replace?i.domainTools:{tools:i.domainTools.tools.concat(N.tools),functionList:Object.assign(N.functionList,i.domainTools.functionList),instructions:i.instructions?i.instructions+N.instructions:N.instructions},i.code&&R.tools.push({type:"code_interpreter"}),i.retrieval&&R.tools.push({type:"retrieval"}),console.log(R.instructions);let q={provider:i.provider,model:i.model,domainTools:R,instructions:R.instructions,assistantName:i.assistantName,assistant:null,assistantid:i.assistantid,thread:null,threadid:i.threadid,appEnv:null,client:O,run:null,assistantApi:E(O,i.provider),code:i.code,retrieval:i.retrieval,userData:i.userData,user:i.user};q.appEnv=await async function(t){let e={host:null,logonPayload:null,store:null,source:"none",currentSource:"none",session:null,servers:null,serverName:null,casServerName:null,sessionID:null,compute:{},cas:{},restaf:a,restaflib:r,restafedit:n};if(null==t)return e;if("none"==t.source)return e.userData=t.userData,e.logonPayload=t.logonPayload,e.currentSource="none",e;let{source:s,logonPayload:i}=t,o=s.split(",")[0];e.currentSource=o,e.host=i.host;let l=a.initStore({casProxy:!0});if(await l.logon(i),e.host=i.host,e.logonPayload=i,e.store=l,s.indexOf("cas")>=0){let{session:t,servers:s}=await r.casSetup(l,null),a=t.links("execute","link","server");e.cas={session:t,servers:s,casServerName:a};let n=await l.apiCall(t.links("self"));e.cas.sessionID=n.items("id"),"cas"===o&&(e.source="cas",e.session=t,e.servers=s,e.serverName=a,e.casServerName=a,e.sessionID=e.cas.sessionID)}if(s.indexOf("compute")>=0){e.compute={servers:null};try{let t=await r.computeSetup(l),s=await l.apiCall(e.session.links("self"));e.compute.sessionID=s.items("id"),"compute"===o&&(e.source="compute",e.session=t,e.servers=null,e.serverName=null,e.sessionID=e.compute.sessionID)}catch(t){console.log(JSON.stringify(t,null,4))}}return e}(i.viyaConfig),q.appEnv.userData=i.userData,q.appEnv.user=i.user,q.assistant=await async function(t){let{assistantName:e,model:s,assistantid:a,instructions:r,domainTools:n,assistantApi:i}=t;try{if("NEW"!==a&&"REUSE"!==a)return console.log("Using assistantid ",a),await i.getAssistant(a);let t={name:e,instructions:r,model:s,tools:n.tools};console.log("Attempting to find assistant by name ",e);let o=null;return o=(await i.listAssistants({order:"desc",limit:"100"})).data.find(t=>{if(t.name===e)return t}),null!=o&&"REUSE"===a?(console.log("Found assistant ",e,o.id),o):(null!=o&&(console.log("Deleting old assistant ",e,o.id),await i.deleteAssistant(o.id)),console.log("Creating new assistant"),o=await i.createAssistant(t),o)}catch(t){throw console.log(t),new Error(`Error status ${t.status}. Failed to create assistant. See console for details.`)}}(q),q.thread=await async function(t){let{assistant:e,assistantApi:s}=t,a=null,r=t.threadid,n=e.metadata.lastThread;console.log("loadThread",r,n);try{return"REUSE"!==r&&"NEW"!==r?(console.log("Using threadid ",r),await s.getThread(r)):"REUSE"===r&&null!=n?(console.log("Attempting to use previous ",n),await s.getThread(n)):(null!=n&&(console.log("Deleting last thread",n),await s.deleteThread(n)),console.log("Creating new thread"),a=await s.createThread(),a)}catch(t){throw console.log(t),new Error(`Error status ${t.status}. Failed to create thread. See console for details.`)}return a}(q);let D=await q.assistantApi.updateAssistant(q.assistant.id,{metadata:{lastThread:q.thread.id}});return q.assistant=D,q.threadid=q.thread.id,console.log("--------------------------------------"),console.log("Current session:"),console.log("Provider: ",q.provider),console.log("Model: ",q.model),console.log("Assistant: ",q.assistant.name,"Assistant id",q.assistant.id),console.log("Threadid: ",q.thread.id),console.log("Viya Source:",q.appEnv.source),console.log("--------------------------------------"),q}async function N(t,e){let{thread:s,assistantApi:a}=t;const r=await a.listMessages(s.id,{limit:e});let n=[],i=r.data;for(let t=0;t<r.data.length;t++){let e=i[t].content[0];if("assistant"!==i[t].role)break;n.push({id:i[t].id,role:i[t].role,type:e.type,content:e[e.type].value})}return n.length>1&&(n=n.reverse()),n}async function R(t,e){let{assistantApi:s,thread:a}=e,r=null,n=null;function i(t){return new Promise(e=>setTimeout(e,t))}do{n=await s.getRun(a.id,t.id),console.log("-------------------",n.status),"queued"!==n.status&&"in_progress"!==n.status&&"cancelling"!==n.status?r=n.status:(await i(500),console.log("waited 500 ms"))}while(null===r);return n}function q(t,e,s){return"openai"===s?{tool_call_id:t,output:JSON.stringify(e)}:{toolCallId:t,output:JSON.stringify(e)}}async function D(t,e,s){let{thread:a,assistantApi:r}=t;try{await r.createMessage(a.id,"user",e)}catch(t){throw console.log(t.status),console.log(t.error),new Error(`\n     Request failed on adding user message to thread.\n     See error below. \n     If thread is active, you can try canceling the run.\n     ${t.status} ${t.error}`)}let n=await async function(t,e,s){let{assistantApi:a,assistant:r,thread:n}=t,i={assistantId:r.id,instructions:null!=s?s:null},o=await a.createRun(n.id,i);t.run=o;let l,u=await R(o,t);return"completed"===u.status?l=await N(t,5):"requires_action"===u.status?(await async function(t,e){let{assistantApi:s,appEnv:a,domainTools:r,provider:n,thread:i,run:o}=e,{functionList:l}=r,u="openai"===n?t.required_action.submit_tool_outputs.tool_calls:t.requiredAction.submitToolOutputs.toolCalls,c=[];for(let t of u){let s=t.function.name;console.log("Requested function: ",s);let r=JSON.parse(t.function.arguments);if(null==l[s])c.push(q(t.id,`Function ${s} not found. \n      Probable causes: \n        Using thread that had outdated tool references.\n        Currrent specs point has mistmatch with function name\n        `,n));else try{let i=await l[s](r,a,e);c.push("openai"===n?{tool_call_id:t.id,output:JSON.stringify(i)}:{toolCallId:t.id,output:JSON.stringify(i)})}catch(e){c.push(q(t.id,e,n))}}let d="openai"===n?await s.submitToolOutputsToRun(i.id,o.id,{tool_outputs:c}):await s.submitToolOutputsToRun(i.id,o.id,c);return await R(d,e)}(u,t),console.log("getting latest message "),l=await N(t,5)):l=[{runStatus:u.status}],l}(t,0,s);return n}async function I(t,e){let{assistantApi:s,assistant:a}=t;if(console.log("in closeAssistant"),null!=e)try{if(null!=e)return await s.deleteAssistant(id),`Assistant ${e} deleted.`}catch(t){throw console.log(t),new Error(`\n        Delete of assistant ${e} failed`)}try{if(null!=a.metadata.lastThread){let e=await s.deleteThread(a.metadata.lastThread);return console.log("Thread ${assistant.metadata.lastThread} deleted",e),e=await s.deleteAssistant(a.id),console.log(`Assistant ${a.name} deleted`,e),t.assistant=null,t.assistantid="0",`Assistant ${a.name} deleted`}}catch(t){throw console.log(t),new Error(`Failed to delete session and thread\n    ${t}`)}}async function $(t,e){let{thread:s,assistantApi:a}=t;return(await a.listMessages(s.id,{limit:e})).data.map(t=>{let e=t.content[0];return{id:t.id,role:t.role,type:e.type,content:e[e.type].value}})}async function j(t,e,s,a,r){let{assistantApi:n,assistant:i,provider:o}=r,l="openai"===o?await n.uploadFile(e,a):await n.uploadFile(s,a,{filename:t}),u=[].concat(i.file_ids);u.push(l.id),console.log("currentFiles ",u),u=u.filter(t=>null!=t);try{let t={fileIds:u},e=await n.updateAssistant(i.id,t);r.assistant=e}catch(e){throw console.log(e),new Error(`Failed to update assistant with new file ${t}`)}return u}async function C(t,e,s){let{assistantApi:a,assistant:r,thread:n,run:i}=t;if(null!=e&&null!=s)try{return console.log("Cancelling run",e,s),await a.cancelRun(e,s)}catch(t){throw s}if(null==i||null==n)return"No run or thread to cancel";try{let t=await a.getRun(n.id,i.id);return null!==t.completed||"cancelling"===t.status?`Run ${i.id} status: ${t.status} , completed: ${t.completed}`:await a.cancelRun(n.id,i.id)}catch(t){throw new Error(`\n    Cancel run failed.  \n    Best action is to simply wait for a while for it to timeout \n    The last alternative is to delete the Assistant ${r.name} and restart your session`)}}export{C as cancelRun,I as deleteAssistant,N as getLatestMessage,$ as getMessages,D as runAssistant,O as setupAssistant,j as uploadFile};
//# sourceMappingURL=index.modern.js.map
