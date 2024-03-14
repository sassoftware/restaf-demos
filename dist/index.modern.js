import t from"openai";import{AssistantsClient as e,AzureKeyCredential as s}from"@azure/openai-assistants";import a from"@sassoftware/restafedit";import r from"@sassoftware/restaflib";import i from"@sassoftware/restaf";function n(t,e){let s={},a="cas"===e?"caslib":"libref",r=t.split(".");return 2===r.length?(s[a]=r[0],s.name=r[1],s):null}function o(t){if(0===t.length)return"";let e=Object.keys(t[0]).join(",")+"\n",s="";return t.map(t=>{let e="",a="";Object.values(t).map(t=>{e=e+a+function(t){let e;return e="."==t||null==t?"":"string"==typeof t?(t=t.replace(/"/g,'""')).trim():t.toString(),e}(t),a=","}),s=s+e+"\n"}),e+s}const{caslRun:l,computeRun:u,computeResults:c}=r,{getLibraryList:d,getTableList:m}=a;async function f(t,e){let{resource:s,limit:a}=t,r=e.store;if(a=null==a?10:a,!1===["files","folders","reports"].includes(s.toLowerCase()))return`{Error: "resource ${s} is not supported at this time"}`;let i=(await r.addServices(s))[s],n={qs:{limit:a,start:0}},o=(await r.apiCall(i.links(s),n)).itemsList().toJS();return JSON.stringify(o)}async function h(t,e){let{limit:s,start:a}=t,r={qs:{limit:null==s?10:s,start:null==a?0:a}},i=await d(e,r);return JSON.stringify(i)}async function y(t,e){let{library:s,limit:a}=t,r={qs:{limit:null==a?10:a,start:0}},i=await m(s,e,r);return JSON.stringify(i)}async function b(t,e){let{table:s}=t,{source:a}=e;if(null===n(s,a))return"Table must be specified in the form casuser.cars or sashelp.cars";let r=await m(library,e,p);return JSON.stringify(r)}async function g(t,e){let s=await v(t,e);return JSON.stringify({table:s.table,data:s.data})}async function w(t,e){let{src:s}=t,{store:a,session:r}=e;if("cas"===e.source){let t=await l(a,r,s,{},!0);return JSON.stringify(t.results)}{let t=await u(a,r,s);return function(t){let e=[];return t.map(t=>{let s=t.line.replace(/(\r\n|\n|\r)/gm,"");e.push(0===s.length?"   ":s)}),e}(await c(a,t,"log"))}}async function S(t){let{keywords:e,format:s}=t;switch(console.log("keywords",e,s),s){case"html":{let t="<ul>";return e.split(",").forEach(e=>{t+=`<li>${e}</li>`}),t+="</ul>",t}case"array":return e.split(",");case"object":{let t={};return e.split(",").forEach((e,s)=>{t[`key${s}`]=e}),t}default:return t}}async function A(t,e){let s=await v(t,e);return JSON.stringify(s)}async function v(t,e){let{table:s,limit:r,format:i,where:l,csv:u}=t,{source:c,sessionID:d}=e;u=null!=u&&u;let p=n(s,c);if(null===p)return"Table must be specified in the form casuser.cars or sashelp.cars";let m={source:c,table:p,casServerName:e.casServerName,computeContext:e.computeContext,initialFetch:{qs:{start:0,limit:null==r?2:r,format:null!=i&&i,where:null==l?"":l}}},f=await a.setup(e.logonPayload,m,d),h={};try{await a.scrollTable("first",f),h={table:p,tableSummary:await a.getTableSummary(f),columns:f.state.columns,data:!1===u?f.state.data:o(f.state.data)}}catch(t){console.log(t),h={error:t}}return h}const T={name:"_getData",description:"Fetch data from a  table like casuser.cars.\n                To limit the number of rows, specify the limit parameter.\n                If format is true, then the data will be formatted.\n                Use standard where clause to filter the data.\n                To return data in csv format, specify csv = true. Default is false.",parameters:{properties:{table:{type:"string",description:"The table to setup. The form of the table is casuser.cars"},limit:{type:"integer",description:"Fetch only the specified number of rows"},format:{type:"boolean",description:"Format the string - true or false"},where:{type:"string",description:'A where clause like Make eq "Audi"'},csv:{type:"boolean",description:"Return data in csv format - true or false"}},type:"object",required:["table"]}},k={name:"_listSASObjects",description:"list SAS resources like reports, files, folders. Specify the limit parameter to limit the number of items returned",parameters:{properties:{resource:{type:"string",description:"The objecttable to setup. The form of the table is casuser.cars"},limit:{type:"integer",description:"Get this many items"}},type:"object",required:["resource","limit"]}},_={name:"_listSASDataLib",description:"list available SAS libs, calibs, librefs.\n     A example would be list libs. \n     If limit is not is specified, then the function \n     will return the first 10 libs.\n     Optionally allow user to specify the source as cas or compute.",parameters:{properties:{limit:{type:"integer",description:"Return only this many libs. If not specified, then return 10 libs."},source:{type:"string",description:"The source of the data. cas or compute",enum:["cas","compute"]}},type:"object"}},O={name:"_listSASTables",description:"for a given library, lib or caslibs get the list of available tables\n    (ex: list tables for Samples)\n    Optionally let user specify the source as cas or compute.",parameters:{properties:{library:{type:"string",description:"A SAS library like casuser, sashelp, samples"},limit:{type:"integer",description:"Return only this many tables. If not specified, then return 10 tables."},source:{type:"string",description:"The source of the data. cas or compute",enum:["cas","compute"]}},type:"object",required:["library"]}},I={name:"_listColumns",description:"Get schema or columns for specified table. Table is of the form sashelp.cars",parameters:{properties:{table:{type:"string",description:"A table like sashelp.cars"}},type:"object",required:["table"]}},N={name:"_describeTable",description:"Describe the table like sashelp.cars . return information on the table like columns, types, keys. Optionally format the data",parameters:{properties:{table:{type:"string",description:"A table like sashelp.cars"},format:{type:"boolean",description:"If true then format the data"}},type:"object",required:["table"]}},q={name:"_runSAS",description:"run the specified file. The file is a path to the sas program",parameters:{properties:{file:{type:"string",description:"this is the file to run"}},type:"object",required:["file"]}},R={name:"_keywords",description:"format a comma-separated keywords like a,b,c into html, array, object",parameters:{properties:{keywords:{type:"string",description:"A comma-separated list of keywords like a,b,c"},format:{type:"string",enum:["html","array","object"],description:"Format the string"}},type:"object",required:["keywords","format"]}};function j(t,e){let s=t;return"openai"===e&&(s={listAssistants:(t=>(...e)=>{let[s]=e;return t.beta.assistants.list(s)})(t),createAssistant:(t=>(...e)=>{let[s]=e;return t.beta.assistants.create(s)})(t),getAssistant:(t=>(...e)=>{let[s]=e;return t.beta.assistants.retrieve(s)})(t),deleteAssistant:(t=>(...e)=>{let[s]=e;return t.beta.assistants.del(s)})(t),updateAssistant:(t=>(...e)=>{let[s,a]=e;return a.fileIds&&(a.file_ids=a.fileIds,delete a.fileIds),console.log(a),t.beta.assistants.update(s,a)})(t),createThread:(t=>(...e)=>{let[s]=e;return null==s&&(s={}),t.beta.threads.create(s)})(t),getThread:(t=>(...e)=>{let[s]=e;return t.beta.threads.retrieve(s)})(t),deleteThread:(t=>(...e)=>{let[s]=e;return t.beta.threads.del(s)})(t),createMessage:(t=>(...e)=>{let[s,a,r]=e;return t.beta.threads.messages.create(s,{role:a,content:r})})(t),listMessages:(t=>(...e)=>{let[s,a]=e;return t.beta.threads.messages.list(s,a)})(t),uploadFile:(t=>(...e)=>{let[s,a]=e;return t.files.create({file:s,purpose:a})})(t),createRun:(t=>(...e)=>{let[s,a]=e;return t.beta.threads.runs.create(s,{assistant_id:a.assistantId,instructions:a.instructions})})(t),getRun:(t=>(...e)=>{let[s,a]=e;return t.beta.threads.runs.retrieve(s,a)})(t),listRuns:(t=>(...e)=>{let[s]=e;return t.beta.threads.runs.list(s)})(t),cancelRun:(t=>(...e)=>{let[s,a]=e;return t.beta.threads.runs.cancel(s,a)})(t),submitToolOutputsToRun:(t=>(...e)=>{let[s,a,r]=e;return t.beta.threads.runs.submitToolOutputs(s,a,r)})(t)}),s}async function C(a){let{credentials:n}=a,{key:o,endPoint:l}=n,u=null;u="openai"===a.provider?new t({apiKey:o,dangerouslyAllowBrowser:!0}):new e(l,new s(o,{}));let c=function(t,e,s){let a=[k,_,O,I,N,T,q,R],r=[];return a.forEach(t=>{let e={type:"function",function:Object.assign({},t)};r.push(e)}),{specs:a,tools:r,functionList:{_getData:g,_listSASObjects:f,_listSASTables:y,_listColumns:b,_listSASDataLib:h,_runSAS:w,_keywords:S,_describeTable:A},instructions:"\n You are a Assistant designed for SAS users. You can help SAS users with their SAS related questions and provide information\n  on topics like libraries, reports, tables. You can also fetch data from tables and run SAS programs. You can also help answer questions about the \n  data that has been returned from previous queries.\n\n  If the response from a tool is of the form [{a:1,b:2},{a:1,b:3}] format the table as a html table element like this\n  '<table>\n     <tr>\n       <th>a</th> \n      <th>b</th>\n     </tr>\n    <tr>\n    <td>1</td>\n    <td>2</td>\n    </tr>\n    <tr>\n   <td>2</td>\n   <td>3</td>\n   </tr>\n   </table>' \n  \n  if the response from a tool is of the form [1,2,3] then return the data as a html unodered list to the user.\n  You can also allow users to attach files to the assistant. \n\n  "}}(),d={};d=!0===a.domainTools.replace?a.domainTools:{tools:a.domainTools.tools.concat(c.tools),functionList:Object.assign(a.domainTools.functionList,c.functionList),instructions:a.instructions?a.instructions+c.instructions:c.instructions},a.code&&d.tools.push({type:"code_interpreter"}),a.retrieval&&d.tools.push({type:"retrieval"});let p={provider:a.provider,model:a.model,domainTools:d,instructions:d.userInstructions,assistantName:a.assistantName,assistant:null,assistantid:a.assistantid,thread:null,threadid:a.threadid,appEnv:null,client:u,run:null,assistantApi:j(u,a.provider),retrieval:a.retrieval};return p.appEnv=await async function(t){let e={host:null,logonPayload:null,store:null,source:"none",currentSource:"none",session:null,servers:null,serverName:null,casServerName:null,sessionID:null,compute:{},cas:{},userData:null};if(null==t)return e;if("none"==t.source)return e.userData=t.userData,e.logonPayload=t.logonPayload,e.currentSource="none",e;let{source:s,logonPayload:a}=t,n=s.split(",")[0];e.currentSource=n,e.host=a.host;let o=i.initStore({casProxy:!0});if(await o.logon(a),e.host=a.host,e.logonPayload=a,e.store=o,s.indexOf("cas")>=0){let{session:t,servers:s}=await r.casSetup(o,null),a=t.links("execute","link","server");e.cas={session:t,servers:s,casServerName:a};let i=await o.apiCall(t.links("self"));e.cas.sessionID=i.items("id"),"cas"===n&&(e.source="cas",e.session=t,e.servers=s,e.serverName=a,e.casServerName=a,e.sessionID=e.cas.sessionID)}if(s.indexOf("compute")>0){e.compute={servers:null};let t=await r.computeSetup(o),s=await o.apiCall(e.session.links("self"));e.compute.sessionID=s.items("id"),"compute"===n&&(e.source="compute",e.session=t,e.servers=null,e.serverName=null,e.sessionID=e.compute.sessionID)}return e}(a.viyaConfig),p.assistant=await async function(t){let{assistantName:e,model:s,assistantid:a,instructions:r,domainTools:i,assistantApi:n}=t,o={name:e,instructions:r,model:s,tools:i.tools},l=null;return 0==("0"===a||null==a)?l=await n.getAssistant(a):null!=e&&(l=(await n.listAssistants({order:"desc",limit:"100"})).data.find(t=>{if(t.name===e)return t}),null==l&&(console.log("Creating new assistant"),l=await n.createAssistant(o))),t.assistantid=l.id,t.assistant=l,l}(p),p.thread=await async function(t){let{assistant:e,assistantApi:s}=t,a=null,r=t.threadid;try{if("-1"===r&&(r=e.metadata.lastThread,null!=r&&console.log("Attempting to use previous ",r)),"0"===r||null==r){console.log("Creating new thread"),a=await s.createThread();let r=await s.updateAssistant(e.id,{metadata:{lastThread:a.id}});t.assistant=r}else a=await s.getThread(r)}catch(t){throw console.log(t),new Error(`Error status ${t.status}. Failed to create thread. See console for details.`)}return a}(p),p.threadid=p.thread.id,console.log("--------------------------------------"),console.log("Current session:"),console.log("Provider: ",p.provider),console.log("Model: ",p.model),console.log("Assistant: ",p.assistant.name,"Assistant id",p.assistant.id),console.log("Threadid: ",p.thread.id),console.log("Viya Source:",p.appEnv.source),console.log("--------------------------------------"),p}async function D(t,e){let{thread:s,assistantApi:a}=t;const r=await a.listMessages(s.id,{limit:e});let i=[],n=r.data;for(let t=0;t<r.data.length;t++){let e=n[t].content[0];if("assistant"!==n[t].role)break;i.push({id:n[t].id,role:n[t].role,type:e.type,content:e[e.type].value})}return i.length>1&&(i=i.reverse()),i}async function $(t,e){let{assistantApi:s,thread:a}=e,r=null,i=null;function n(t){return new Promise(e=>setTimeout(e,t))}do{i=await s.getRun(a.id,t.id),console.log("-------------------",i.status),"queued"!==i.status&&"in_progress"!==i.status&&"cancelling"!==i.status?r=i.status:(await n(2e3),console.log("waited 2000 ms"))}while(null===r);return i}function E(t,e,s){return"openai"===s?{tool_call_id:t,output:JSON.stringify(e)}:{toolCallId:t,output:JSON.stringify(e)}}async function F(t,e,s){let{thread:a,assistantApi:r}=t;try{await r.createMessage(a.id,"user",e)}catch(t){throw console.log(t.status),console.log(t.error),new Error(`\n     Request failed on adding user message to thread.\n     See error below. \n     If thread is active, you can try canceling the run.\n     ${t.status} ${t.error}`)}let i=await async function(t,e,s){let{assistantApi:a,assistant:r,thread:i}=t,n={assistantId:r.id,instructions:null!=s?s:""},o=await a.createRun(i.id,n);t.run=o;let l,u=await $(o,t);return"completed"===u.status?l=await D(t,5):"requires_action"===u.status?(await async function(t,e){let{assistantApi:s,appEnv:a,domainTools:r,provider:i,thread:n,run:o}=e,{functionList:l}=r,u="openai"===i?t.required_action.submit_tool_outputs.tool_calls:t.requiredAction.submitToolOutputs.toolCalls,c=[];for(let t of u){let s=t.function.name;console.log("Requested function: ",s);let r=JSON.parse(t.function.arguments);if(null==l[s])c.push(E(t.id,`Function ${s} not found. \n      Probable causes: \n        Using thread that had outdated tool references.\n        Currrent specs point has mistmatch with function name\n        `,i));else try{let n=await l[s](r,a,e);c.push("openai"===i?{tool_call_id:t.id,output:JSON.stringify(n)}:{toolCallId:t.id,output:JSON.stringify(n)})}catch(e){c.push(E(t.id,e,i))}}let d="openai"===i?await s.submitToolOutputsToRun(n.id,o.id,{tool_outputs:c}):await s.submitToolOutputsToRun(n.id,o.id,c);return await $(d,e)}(u,t),console.log("getting latest message "),l=await D(t,5)):l=[{runStatus:u.status}],l}(t,0,s);return i}async function J(t,e){let{assistantApi:s,assistant:a}=t;if(console.log("in closeAssistant"),null!=e)try{if(null!=e)return await s.deleteAssistant(id),`Assistant ${e} deleted.`}catch(t){throw console.log(t),new Error(`\n        Delete of assistant ${e} failed`)}try{if(null!=a.metadata.lastThread){let t=await s.deleteThread(a.metadata.lastThread);return console.log("Thread ${assistant.metadata.lastThread} deleted",t),t=await s.deleteAssistant(a.id),console.log(`Assistant ${a.name} deleted`,t),`Assistant ${a.name} deleted`}}catch(t){throw console.log(t),new Error(`Failed to delete session and thread\n    ${t}`)}}async function L(t,e){let{thread:s,assistantApi:a}=t;return(await a.listMessages(s.id,{limit:e})).data.map(t=>{let e=t.content[0];return{id:t.id,role:t.role,type:e.type,content:e[e.type].value}})}async function P(t,e,s,a,r){let{assistantApi:i,assistant:n,provider:o}=r,l="openai"===o?await i.uploadFile(e,a):await i.uploadFile(s,a,{filename:t}),u=[].concat(n.file_ids);u.push(l.id),console.log("currentFiles ",u),u=u.filter(t=>null!=t);try{let t={fileIds:u},e=await i.updateAssistant(n.id,t);r.assistant=e}catch(e){throw console.log(e),new Error(`Failed to update assistant with new file ${t}`)}return u}async function x(t,e,s){let{assistantApi:a,assistant:r,thread:i,run:n}=t;if(null!=e&&null!=s)try{return console.log("Cancelling run",e,s),await a.cancelRun(e,s)}catch(t){throw s}if(null==n||null==i)return"No run or thread to cancel";try{let t=await a.getRun(i.id,n.id);return null!==t.completed||"cancelling"===t.status?`Run ${n.id} status: ${t.status} , completed: ${t.completed}`:await a.cancelRun(i.id,n.id)}catch(t){throw new Error(`\n    Cancel run failed.  \n    Best action is to simply wait for a while for it to timeout \n    The last alternative is to delete the Assistant ${r.name} and restart your session`)}}export{x as cancelRun,J as deleteAssistant,D as getLatestMessage,L as getMessages,F as runAssistant,C as setupAssistant,P as uploadFile};
//# sourceMappingURL=index.modern.js.map
