import t from"openai";import{AssistantsClient as e,AzureKeyCredential as s}from"@azure/openai-assistants";import n from"@sassoftware/restaf";import a from"@sassoftware/restaflib";import r from"@sassoftware/restafedit";function i(t,e){let s={},n="cas"===e?"caslib":"libref",a=t.split(".");return 2===a.length?(s[n]=a[0],s.name=a[1],s):null}function o(t){if(0===t.length)return"";let e=Object.keys(t[0]).filter(t=>!("_rowIndex"===t||"_modified"===t)).join(",")+"\n",s="";return t.map(t=>{let e="",n="";for(let s in t)"_rowIndex"!==s&&"_modified"!==s&&(e=e+n+l(t[s]),n=",");s=s+e+"\n"}),e+s}function l(t){let e;return e="."==t||null==t?"":"string"==typeof t?(t=t.replace(/"/g,'""')).trim():t.toString(),e}async function d(t,e,s){let{metadata:n}=t,{store:a}=e;console.log("metadata",n);try{let{catalog:t}=await a.addServices("catalog"),e={qs:{q:n}},s=await a.apiCall(t.links("search"),e);return JSON.stringify(s.items(),null,4)}catch(t){return console.log(JSON.stringify(t)),"Error searching catalog"}}async function u(t,e){let{resource:s,limit:n}=t,a=e.store;if(n=null==n?10:n,!1===["files","folders","reports"].includes(s.toLowerCase()))return`{Error: 'resource ${s} is not supported at this time'}`;let r=(await a.addServices(s))[s],i={qs:{limit:n,start:0}},o=(await a.apiCall(r.links(s),i)).itemsList();return JSON.stringify(o,null,4)}async function c(t,e){let{limit:s,start:n}=t,a={qs:{limit:null==s?10:s,start:null==n?0:n}},r=await e.restafedit.getLibraryList(e,a);return JSON.stringify(r,null,4)}async function h(t,e){let{library:s,limit:n}=t,a={qs:{limit:null==n?10:n,start:0}},r=await e.restafedit.getTableList(s,e,a);return JSON.stringify(r,null,4)}async function f(t,e){let{table:s}=t,{source:n}=e;if(null===i(s,n))return"Table must be specified in the form casuser.cars or sashelp.cars";let a=await e.restafedit.getTableList(library,e,p);return JSON.stringify(a,null,4)}async function m(t,e){let s=await w(t,e);return JSON.stringify({table:s.table,data:s.data},null,4)}async function b(t,e,s){let{program:n}=t,{store:a,session:r,restaflib:i}=e;try{if("cas"===e.source){let t=await i.caslRun(a,r,n,{},!0);return JSON.stringify(t.results,null,4)}if(e){let t=await computeRun(a,r,src);return function(t){let e=[];return t.map(t=>{let s=t.line.replace(/(\r\n|\n|\r)/gm,"");e.push(0===s.length?"   ":s)}),e}(await i.computeResults(a,t,"log"))}return"Cannot run program without a session"}catch(t){return console.log(t),"Error running program "+n}}async function g(t){let{keywords:e,format:s}=t;switch(console.log("keywords",e,s),s){case"html":{let t="<ul>";return e.split(",").forEach(e=>{t+=`<li>${e}</li>`}),t+="</ul>",t}case"array":return e.split(",");case"object":{let t={};return e.split(",").forEach((e,s)=>{t[`key${s}`]=e}),t}default:return t}}async function y(t,e){let s=await w(t,e);return JSON.stringify(s,null,4)}async function w(t,e){let{table:s,limit:n,format:a,where:r,csv:l}=t,{source:d,sessionID:u,restafedit:c}=e;l=null!=l&&l,console.log(t);let h=i(s,d);if(null===h)return"Table must be specified in the form casuser.cars or sashelp.cars";let f={source:d,table:h,casServerName:e.casServerName,computeContext:e.computeContext,initialFetch:{qs:{start:0,limit:null==n?2:n,format:null!=a&&a,where:null==r?"":r}}},p=await c.setup(e.logonPayload,f,u),m={};try{await c.scrollTable("first",p),m={table:h,tableSummary:await c.getTableSummary(p),columns:p.state.columns,data:!1!==l?p.state.data:o(p.state.data)}}catch(t){console.log(t),m={error:t}}return m}const S={name:"_catalogSearch",description:"Search for the specified metadata in SAS Viya.\n      the search is specified as a comma delimited string like libname:casuser,Columns:Make,name:abc\n      Convert string to a query string using these patterns:\n      libname xxx to libname:xxx\n      Column xxx to Column.name:xxx\n      \n      ",parameters:{properties:{metadata:{type:"string",description:"The metadata to return"}},type:"object",required:["metadata"]}},A={name:"_getData",description:"Fetch data from a  table like casuser.cars.\n                To limit the number of rows, specify the limit parameter.\n                If format is true, then the data will be formatted.\n                Use standard where clause to filter the data.\n                To return data in csv format, specify csv = true. Default is false.",parameters:{properties:{table:{type:"string",description:"The table to setup. The form of the table is casuser.cars"},limit:{type:"integer",description:"Fetch only the specified number of rows"},format:{type:"boolean",description:"Format the string - true or false"},where:{type:"string",description:'A where clause like Make eq "Audi"'},csv:{type:"boolean",description:"Return data in csv format - true or false"}},type:"object",required:["table"]}},v={name:"_listSASObjects",description:"list SAS resources like reports, files, folders. Specify the limit parameter to limit the number of items returned",parameters:{properties:{resource:{type:"string",description:"The objecttable to setup. The form of the table is casuser.cars"},limit:{type:"integer",description:"Get this many items"}},type:"object",required:["resource","limit"]}},T={name:"_listSASDataLib",description:"list available SAS libs, calibs, librefs or libraries.\n     This tool is the only one that can answer questions like this.\n\n     A example would be list libs. \n     If limit is not is specified, then the function \n     will return the first 10 libs.\n    ",parameters:{properties:{limit:{type:"integer",description:"Return only this many libs. If not specified, then return 10 libs."},source:{type:"string",description:"The source of the data. cas or compute",enum:["cas","compute"]}},type:"object"}},k={name:"_listSASTables",description:"for a given SAS library, lib, caslibs or libref get the list of available tables.\n    (ex: list tables for Samples)\n    Optionally let user specify the source as cas or compute.",parameters:{properties:{library:{type:"string",description:"A SAS library like casuser, sashelp, samples"},limit:{type:"integer",description:"Return only this many tables. If not specified, then return 10 tables."},source:{type:"string",description:"The source of the data. cas or compute",enum:["cas","compute"]}},type:"object",required:["library"]}},_={name:"_listColumns",description:"Get schema or columns for specified SAS  table. Table is of the form sashelp.cars",parameters:{properties:{table:{type:"string",description:"A table like sashelp.cars"}},type:"object",required:["table"]}},x={name:"_describeTable",description:"Describe the SAS table like sashelp.cars . return information on the table like columns, types, keys. Optionally format the data",parameters:{properties:{table:{type:"string",description:"A table like sashelp.cars"},format:{type:"boolean",description:"If true then format the data"}},type:"object",required:["table"]}},N={name:"_runSAS",description:"run the specified sas program",parameters:{properties:{program:{type:"string",description:"this is the program to run"}},type:"object",required:["program"]}},I={name:"_keywords",description:"format a comma-separated keywords like a,b,c into html, array, object",parameters:{properties:{keywords:{type:"string",description:"A comma-separated list of keywords like a,b,c"},format:{type:"string",enum:["html","array","object"],description:"Format the string"}},type:"object",required:["keywords","format"]}};function q(t,e){let s=t;return"openai"===e&&(s={listAssistants:(t=>(...e)=>{let[s]=e;return t.beta.assistants.list(s)})(t),createAssistant:(t=>(...e)=>{let[s]=e;return t.beta.assistants.create(s)})(t),getAssistant:(t=>(...e)=>{let[s]=e;return t.beta.assistants.retrieve(s)})(t),deleteAssistant:(t=>(...e)=>{let[s]=e;return t.beta.assistants.del(s)})(t),updateAssistant:(t=>(...e)=>{let[s,n]=e;return n.fileIds&&(n.file_ids=n.fileIds,delete n.fileIds),t.beta.assistants.update(s,n)})(t),createThread:(t=>(...e)=>{let[s]=e;return null==s&&(s={}),t.beta.threads.create(s)})(t),getThread:(t=>(...e)=>{let[s]=e;return t.beta.threads.retrieve(s)})(t),deleteThread:(t=>(...e)=>{let[s]=e;return t.beta.threads.del(s)})(t),createMessage:(t=>(...e)=>{let[s,n,a,r]=e,i={role:n,content:a};return null!=r&&(i=Object.assign(i,r)),t.beta.threads.messages.create(s,i)})(t),listMessages:(t=>(...e)=>{let[s,n]=e;return t.beta.threads.messages.list(s,n)})(t),uploadFile:(t=>(...e)=>{let[s,n]=e;return t.files.create({file:s,purpose:n})})(t),createAssistantFile:(t=>(...e)=>{let[s,n]=e,a={file_id:n};return console.log(a),console.log(s),t.beta.assistants.files.create(s,a)})(t),createRun:(t=>(...e)=>{let[s,n]=e;return t.beta.threads.runs.create(s,{assistant_id:n.assistantId,additional_instructions:n.additionalInstructions,tools:null!=n.tools?n.tools:[]})})(t),getRun:(t=>(...e)=>{let[s,n]=e;return t.beta.threads.runs.retrieve(s,n)})(t),listRuns:(t=>(...e)=>{let[s]=e;return t.beta.threads.runs.list(s)})(t),cancelRun:(t=>(...e)=>{let[s,n]=e;return t.beta.threads.runs.cancel(s,n)})(t),submitToolOutputsToRun:(t=>(...e)=>{let[s,n,a]=e;return t.beta.threads.runs.submitToolOutputs(s,n,a)})(t)}),s}async function E(i){let{credentials:o}=i,{key:l,endPoint:p}=o,w=null;w="openai"===i.provider?new t({apiKey:l,dangerouslyAllowBrowser:!0}):new e(p,new s(l,{}));let E,O=function(t,e,s){let n=[v,T,k,_,x,S,A,N,I],a=[];n.forEach(t=>{let e={type:"function",function:Object.assign({},t)};a.push(e)});let r={_getData:m,_listSASObjects:u,_listSASTables:h,_listColumns:f,_listSASDataLib:c,_runSAS:b,_keywords:g,_describeTable:y,_catalogSearch:d},i="undefined"==typeof window?(console.log("instructions for node use "),"\n You are a Assistant designed for SAS users. You can help SAS users with their SAS related questions and provide information\n  on topics like libraries(alias of libs, caslibs and libref), reports  and tables. You can also fetch data from then tables and run SAS programs. You can also help answer questions about the \n  data that has been returned from previous queries. Most times the user will be focused on these areas.\n  Always try the provided tools first to find an answer to your question. If the query is not clear then ask the user for clarification before creating a response.\n  Always report always include annotation when information is found in a file.\n  "):(console.log("instructions for web"),"\n You are a Assistant designed for SAS users. You can help SAS users with their SAS related questions and provide information\n  on topics like libraries(alias of libs, caslibs and libref), reports  and tables. You can also fetch data from then tables and run SAS programs. You can also help answer questions about the \n  data that has been returned from previous queries. Most times the user will be focused on these areas. \n  try the provided tools and files first to find an answer to your question. If the query is not clear then ask the user for clarification before creating a response.\n  Always include annotation when information is found in a file\n  Here are some tips for formatting the response from the tools.\n  For example,\n\n  Format the response as a html table if the content of the response is one of the following schema:\n\n  - a comma-delimited format \n  - or of this schema [{a:1,b:2},{a:1,b:3},...]\n  - or of this schema{a: {a1:10, bx:20, c: {cx:3, az: 4}} }, {d: {d1:10, d2:20},...}\n\n  Below is an example of a  html table format with nested table\n\n      '<table>     \n         <tr>     \n           <th>Name</th>     \n           <th>Value</th>     \n         </tr>     \n         <tr>     \n           <td>a</td>     \n           <td>     \n             <table>     \n               <tr>     \n                 <th>Name</th>     \n                 <th>Value</th>     \n               </tr>     \n               <tr>     \n                 <td>a1</td>     \n                 <td>10</td>     \n               </tr>     \n               <tr>     \n                 <td>bx</td>     \n                 <td>20</td>     \n               </tr>     \n               <tr>     \n                 <td>c</td>     \n                 <td>     \n                   <table>     \n                     <tr>     \n                       <th>Name</th>     \n                       <th>Value</th>     \n                     </tr>     \n                     <tr>     \n                       <td>cx</td>     \n                       <td>3</td>     \n                     </tr>     \n                     <tr>     \n                       <td>az</td>     \n                       <td>4</td>     \n                     </tr>     \n                   </table>     \n                 </td>     \n               </tr>     \n             </table>     \n           </td>     \n         </tr>     \n         <tr>     \n           <td>d</td>     \n           <td>     \n             <table>     \n               <tr>     \n                 <th>Name</th>     \n                 <th>Value</th>     \n               </tr>     \n               <tr>     \n                 <td>d1</td>     \n                 <td>10</td>     \n               </tr>     \n               <tr>     \n                 <td>d2</td>     \n                 <td>20</td>     \n               </tr>     \n             </table>     \n           </td>     \n         </tr>     \n       </table>     \n     '\n\n  if the response from a tool is of the form  like ['a','b','c', ...] or [1,11,8, ...] then format it as  html unordered list element\n  Below is a sample html unordered list format.\n  '<ul>\n    <li>a</li>\n    <li>b</li>\n    <li>3</li>\n  </ul>'\n\n  if the response from a tool is of the form {a:1,b:2} then format it as  html table with a single column.\n  '<table>\n  <tr>\n  <th>Name</th>\n  <th>Value</th>\n  </tr>\n    <tr>\n      <td>a</td>\n      <td>1</td>\n    </tr>\n    <tr>\n      <td>b</td>\n      <td>1</td>\n    </tr>\n\n  </table>'\n\n  The suggested styling for the html table is as follows:\n    The html table should have a light blue background for the column headers.\n    Use a border width of 1px and solid style for the table.\n");return{specs:n,tools:a,functionList:r,instructions:i}}(),C=[],R=i.domainTools.tools;C=R.length>0?O.tools.filter(t=>{let e=R.findIndex((e,s)=>e.function.name===t.function.name);return-1!==e&&console.log("overriding",t.function.name),-1===e}):O.tools,E=!0===i.domainTools.replace?i.domainTools:{tools:C.concat(R),functionList:Object.assign(O.functionList,i.domainTools.functionList),instructions:i.instructions?i.instructions+O.instructions:O.instructions},i.code&&E.tools.push({type:"code_interpreter"}),i.retrieval&&E.tools.push({type:"retrieval"}),console.log(E.instructions);let D={provider:i.provider,model:i.model,domainTools:E,instructions:E.instructions,assistantName:i.assistantName,assistant:null,assistantid:i.assistantid,thread:null,threadid:i.threadid,appEnv:null,client:w,run:null,assistantApi:q(w,i.provider),code:i.code,retrieval:i.retrieval,userData:i.userData,user:i.user};D.appEnv=await async function(t){let e={host:null,logonPayload:null,store:null,source:"none",currentSource:"none",session:null,servers:null,serverName:null,casServerName:null,sessionID:null,compute:{},cas:{},restaf:n,restaflib:a,restafedit:r};if(null==t)return e;if("none"==t.source)return e.userData=t.userData,e.logonPayload=t.logonPayload,e.currentSource="none",e;let{source:s,logonPayload:i}=t,o=s.split(",")[0];e.currentSource=o,e.host=i.host;let l=n.initStore({casProxy:!0});if(await l.logon(i),e.host=i.host,e.logonPayload=i,e.store=l,s.indexOf("cas")>=0){let{session:t,servers:s}=await a.casSetup(l,null),n=t.links("execute","link","server");e.cas={session:t,servers:s,casServerName:n};let r=await l.apiCall(t.links("self"));e.cas.sessionID=r.items("id"),"cas"===o&&(e.source="cas",e.session=t,e.servers=s,e.serverName=n,e.casServerName=n,e.sessionID=e.cas.sessionID)}if(s.indexOf("compute")>=0){e.compute={servers:null};try{let t=await a.computeSetup(l),s=await l.apiCall(e.session.links("self"));e.compute.sessionID=s.items("id"),"compute"===o&&(e.source="compute",e.session=t,e.servers=null,e.serverName=null,e.sessionID=e.compute.sessionID)}catch(t){console.log(JSON.stringify(t,null,4))}}return e}(i.viyaConfig),D.appEnv.userData=i.userData,D.appEnv.user=i.user,D.assistant=await async function(t){let{assistantName:e,model:s,assistantid:n,instructions:a,domainTools:r,assistantApi:i}=t;try{if("NEW"!==n&&"REUSE"!==n)return console.log("Using assistantid ",n),await i.getAssistant(n);let t={name:e,instructions:a,model:s,tools:r.tools};console.log("Attempting to find assistant by name ",e);let o=null;return o=(await i.listAssistants({order:"desc",limit:"100"})).data.find(t=>{if(t.name===e)return t}),null!=o&&"REUSE"===n?(console.log("Found assistant ",e,o.id),o):(null!=o&&(console.log("Deleting old assistant ",e,o.id),await i.deleteAssistant(o.id)),console.log("Creating new assistant"),o=await i.createAssistant(t),o)}catch(t){throw console.log(t),new Error(`Error status ${t.status}. Failed to create assistant. See console for details.`)}}(D),D.thread=await async function(t){let{assistant:e,assistantApi:s}=t,n=null,a=t.threadid,r=e.metadata.lastThread;console.log("loadThread",a,r);try{return"REUSE"!==a&&"NEW"!==a?(console.log("Using threadid ",a),await s.getThread(a)):"REUSE"===a&&null!=r?(console.log("Attempting to use previous ",r),await s.getThread(r)):(null!=r&&(console.log("Deleting last thread",r),await s.deleteThread(r)),console.log("Creating new thread"),n=await s.createThread(),n)}catch(t){throw console.log(t),new Error(`Error status ${t.status}. Failed to create thread. See console for details.`)}return n}(D);let F=await D.assistantApi.updateAssistant(D.assistant.id,{metadata:{lastThread:D.thread.id}});return D.assistant=F,D.threadid=D.thread.id,console.log("--------------------------------------"),console.log("Current session:"),console.log("Provider: ",D.provider),console.log("Model: ",D.model),console.log("Assistant: ",D.assistant.name,"Assistant id",D.assistant.id),console.log("Threadid: ",D.thread.id),console.log("Viya Source:",D.appEnv.source),console.log("--------------------------------------"),D}async function O(t,e){let{thread:s,assistantApi:n}=t;const a=await n.listMessages(s.id,{limit:e});let r=[],i=a.data;for(let t=0;t<a.data.length;t++){let e=i[t].content[0];if("assistant"!==i[t].role)break;console.log("annotations",e[e.type].annotations),r.push({id:i[t].id,role:i[t].role,type:e.type,content:e[e.type].value})}return r.length>1&&(r=r.reverse()),r}async function C(t,e){let{assistantApi:s,thread:n}=e,a=null,r=null;function i(t){return new Promise(e=>setTimeout(e,t))}do{r=await s.getRun(n.id,t.id),console.log("-------------------",r.status),"queued"!==r.status&&"in_progress"!==r.status&&"cancelling"!==r.status?a=r.status:(await i(500),console.log("waited 500 ms"))}while(null===a);return r}function R(t,e,s){return"openai"===s?{tool_call_id:t,output:JSON.stringify(e)}:{toolCallId:t,output:JSON.stringify(e)}}async function D(t,e,s){let{thread:n,assistantApi:a}=t;try{let s={};"openai"===t.provider?s.file_ids=t.assistant.file_ids:s.fileIds=t.assistant.fileIds,await a.createMessage(n.id,"user",e,s)}catch(t){throw console.log(t.status),console.log(t.error),new Error(`\n     Request failed on adding user message to thread.\n     See error below. \n     If thread is active, you can try canceling the run.\n     ${t.status} ${t.error}`)}let r=await async function(t,e,s){let{assistantApi:n,assistant:a,thread:r}=t;console.log(s);let i={assistantId:a.id,additionalInstructions:F(s),tools:a.tools},o=await n.createRun(r.id,i);t.run=o;let l,d=await C(o,t);return"completed"===d.status?l=await O(t,5):"requires_action"===d.status?(await async function(t,e){let{assistantApi:s,appEnv:n,domainTools:a,provider:r,thread:i,run:o}=e,{functionList:l}=a,d="openai"===r?t.required_action.submit_tool_outputs.tool_calls:t.requiredAction.submitToolOutputs.toolCalls,u=[];for(let t of d){let s=t.function.name;console.log("Requested function: ",s);let a=JSON.parse(t.function.arguments);if(null==l[s])u.push(R(t.id,`Function ${s} not found. \n      Probable causes: \n        Using thread that had outdated tool references.\n        Currrent specs point has mistmatch with function name\n        `,r));else try{console.log(">> Calling function: ",s);let i=await l[s](a,n,e);console.log(">> Function call completed"),u.push("openai"===r?{tool_call_id:t.id,output:JSON.stringify(i)}:{toolCallId:t.id,output:JSON.stringify(i)})}catch(e){u.push(R(t.id,e,r))}}let c="openai"===r?await s.submitToolOutputsToRun(i.id,o.id,{tool_outputs:u}):await s.submitToolOutputsToRun(i.id,o.id,u);return await C(c,e)}(d,t),console.log("getting latest message "),l=await O(t,5)):l=[{runStatus:d.status}],l}(t,0,s);return r}function F(t){let e="\n  \n  Format the response as a html table if the content of the response is one of the following schema:\n\n  - a comma-delimited format \n  - this schema{a: {a1:10, bx:20, c: {cx:3, az: 4}} }, {d: {d1:10, d2:20},...}\n  - this schema [{a1:1,b1:1}, {a1:1, b1:2}. ...}]\n  \n\n  Below is an example of a  html table format with nested table\n\n      '<table>     \n         <tr>     \n           <th>Name</th>     \n           <th>Value</th>     \n         </tr>     \n         <tr>     \n           <td>a</td>     \n           <td>     \n             <table>     \n               <tr>     \n                 <th>Name</th>     \n                 <th>Value</th>     \n               </tr>     \n               <tr>     \n                 <td>a1</td>     \n                 <td>10</td>     \n               </tr>     \n               <tr>     \n                 <td>bx</td>     \n                 <td>20</td>     \n               </tr>     \n               <tr>     \n                 <td>c</td>     \n                 <td>     \n                   <table>     \n                     <tr>     \n                       <th>Name</th>     \n                       <th>Value</th>     \n                     </tr>     \n                     <tr>     \n                       <td>cx</td>     \n                       <td>3</td>     \n                     </tr>     \n                     <tr>     \n                       <td>az</td>     \n                       <td>4</td>     \n                     </tr>     \n                   </table>     \n                 </td>     \n               </tr>     \n             </table>     \n           </td>     \n         </tr>     \n         <tr>     \n           <td>d</td>     \n           <td>     \n             <table>     \n               <tr>     \n                 <th>Name</th>     \n                 <th>Value</th>     \n               </tr>     \n               <tr>     \n                 <td>d1</td>     \n                 <td>10</td>     \n               </tr>     \n               <tr>     \n                 <td>d2</td>     \n                 <td>20</td>     \n               </tr>     \n             </table>     \n           </td>     \n         </tr>     \n       </table>     \n     '\n\n  if the response from a tool is of the form  like ['a','b','c', ...] or [1,11,8, ...] or\n  ['- a','- b','- c', ...] or ['1. xxx', '2. yyy', '3. zzz']\n  then format it as  html ordered or unordered list element\n  Below is a sample html list format.\n  '<ul>\n    <li>a</li>\n    <li>b</li>\n    <li>3</li>\n  </ul>'\n\n\n  if the response from a tool is of the form {a:1,b:2} then format it as  html table with a single column.\n  '<table>\n  <tr>\n  <th>Name</th>\n  <th>Value</th>\n  </tr>\n    <tr>\n      <td>a</td>\n      <td>1</td>\n    </tr>\n    <tr>\n      <td>b</td>\n      <td>1</td>\n    </tr>\n\n  </table>'\n\n  The suggested styling for the html table is as follows:\n    The html table should have a light blue background for the column headers.\n    Use a border width of 1px and solid style for the table.\n\n  \n  ";return null!=t&&(e=t+e),e}async function j(t,e){let{assistantApi:s,assistant:n}=t;if(console.log("in closeAssistant"),null!=e)try{if(null!=e)return await s.deleteAssistant(id),`Assistant ${e} deleted.`}catch(t){throw console.log(t),new Error(`\n        Delete of assistant ${e} failed`)}try{if(null!=n.metadata.lastThread){let e=await s.deleteThread(n.metadata.lastThread);return console.log("Thread ${assistant.metadata.lastThread} deleted",e),e=await s.deleteAssistant(n.id),console.log(`Assistant ${n.name} deleted`,e),t.assistant=null,t.assistantid="0",`Assistant ${n.name} deleted`}}catch(t){throw console.log(t),new Error(`Failed to delete session and thread\n    ${t}`)}}async function $(t,e){let{thread:s,assistantApi:n}=t;return(await n.listMessages(s.id,{limit:e})).data.map(t=>{let e=t.content[0];return{id:t.id,role:t.role,type:e.type,content:e[e.type].value}})}async function J(t,e,s,n,a){let{assistantApi:r,assistant:i,provider:o}=a,l=null;try{l="openai"===o?await r.uploadFile(e,n):await r.uploadFile(s,n,{filename:t}),console.log("uploaded file:",l.id);let d=await r.createAssistantFile(i.id,l.id);return console.log("Assistant File ",d.id),await async function(t,e){let{assistantApi:s,assistant:n,provider:a}=t,r="openai"===a?n.file_ids:n.fileIds;r.push(e.id),r=r.filter(t=>null!=t);try{let e={fileIds:r},a=await s.updateAssistant(n.id,e);t.assistant=a}catch(t){throw console.log(t),new Error(`Failed to update assistant with new file ${e.id}`)}}(a,d),{fileName:t,fileId:l.id,assistantFileId:d.id}}catch(e){throw console.log(e),new Error(`Failed to upload file ${t}`)}}async function L(t,e,s){let{assistantApi:n,assistant:a,thread:r,run:i}=t;if(null!=e&&null!=s)try{return console.log("Cancelling run",e,s),await n.cancelRun(e,s)}catch(t){throw s}if(null==i||null==r)return"No run or thread to cancel";try{let t=await n.getRun(r.id,i.id);return null!==t.completed||"cancelling"===t.status?`Run ${i.id} status: ${t.status} , completed: ${t.completed}`:await n.cancelRun(r.id,i.id)}catch(t){throw new Error(`\n    Cancel run failed.  \n    Best action is to simply wait for a while for it to timeout \n    The last alternative is to delete the Assistant ${a.name} and restart your session`)}}export{L as cancelRun,j as deleteAssistant,O as getLatestMessage,$ as getMessages,D as runAssistant,E as setupAssistant,J as uploadFile};
//# sourceMappingURL=index.modern.js.map
