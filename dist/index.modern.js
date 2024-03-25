import t from"openai";import{AssistantsClient as e,AzureKeyCredential as s}from"@azure/openai-assistants";import a from"@sassoftware/restaf";import n from"@sassoftware/restaflib";import r from"@sassoftware/restafedit";function i(t,e){let s={},a="cas"===e?"caslib":"libref",n=t.split(".");return 2===n.length?(s[a]=n[0],s.name=n[1],s):null}function o(t){if(0===t.length)return"";let e=Object.keys(t[0]).filter(t=>!("_rowIndex"===t||"_modified"===t)).join(",")+"\n",s="";return t.map(t=>{let e="",a="";for(let s in t)"_rowIndex"!==s&&"_modified"!==s&&(e=e+a+l(t[s]),a=",");s=s+e+"\n"}),e+s}function l(t){let e;return e="."==t||null==t?"":"string"==typeof t?(t=t.replace(/"/g,'""')).trim():t.toString(),e}async function u(t,e,s){let{metadata:a}=t,{store:n}=e;console.log("metadata",a);let r=a.replace(/,/g," ");console.log(a);try{let{catalog:t}=await n.addServices("catalog"),e={qs:{q:r}};console.log(e);let s=await n.apiCall(t.links("search"),e);return console.log(s.items().toJS()),JSON.stringify(s.items().toJS())}catch(t){return console.log(JSON.stringify(t)),"Error searching catalog"}}async function c(t,e){let{resource:s,limit:a}=t,n=e.store;if(a=null==a?10:a,!1===["files","folders","reports"].includes(s.toLowerCase()))return`{Error: "resource ${s} is not supported at this time"}`;let r=(await n.addServices(s))[s],i={qs:{limit:a,start:0}},o=(await n.apiCall(r.links(s),i)).itemsList().toJS();return JSON.stringify(o)}async function d(t,e){let{limit:s,start:a}=t,n={qs:{limit:null==s?10:s,start:null==a?0:a}},r=await e.restafedit.getLibraryList(e,n);return JSON.stringify(r)}async function f(t,e){let{library:s,limit:a}=t,n={qs:{limit:null==a?10:a,start:0}},r=await e.restafedit.getTableList(s,e,n);return JSON.stringify(r)}async function m(t,e){let{table:s}=t,{source:a}=e;if(null===i(s,a))return"Table must be specified in the form casuser.cars or sashelp.cars";let n=await e.restafedit.getTableList(library,e,p);return JSON.stringify(n)}async function h(t,e){let s=await w(t,e);return JSON.stringify({table:s.table,data:s.data})}async function g(t,e,s){let{program:a}=t,{store:n,session:r,restaflib:i}=e;try{if("cas"===e.source){let t=await i.caslRun(n,r,a,{},!0);return JSON.stringify(t.results)}if(e){let t=await computeRun(n,r,src);return function(t){let e=[];return t.map(t=>{let s=t.line.replace(/(\r\n|\n|\r)/gm,"");e.push(0===s.length?"   ":s)}),e}(await i.computeResults(n,t,"log"))}return"Cannot run program without a session"}catch(t){return console.log(t),"Error running program "+a}}async function b(t){let{keywords:e,format:s}=t;switch(console.log("keywords",e,s),s){case"html":{let t="<ul>";return e.split(",").forEach(e=>{t+=`<li>${e}</li>`}),t+="</ul>",t}case"array":return e.split(",");case"object":{let t={};return e.split(",").forEach((e,s)=>{t[`key${s}`]=e}),t}default:return t}}async function y(t,e){let s=await w(t,e);return JSON.stringify(s)}async function w(t,e){let{table:s,limit:a,format:n,where:r,csv:l}=t,{source:u,sessionID:c,restafedit:d}=e;l=null!=l&&l,console.log(t);let p=i(s,u);if(null===p)return"Table must be specified in the form casuser.cars or sashelp.cars";let f={source:u,table:p,casServerName:e.casServerName,computeContext:e.computeContext,initialFetch:{qs:{start:0,limit:null==a?2:a,format:null!=n&&n,where:null==r?"":r}}},m=await d.setup(e.logonPayload,f,c),h={};try{await d.scrollTable("first",m),h={table:p,tableSummary:await d.getTableSummary(m),columns:m.state.columns,data:!1!==l?m.state.data:o(m.state.data)}}catch(t){console.log(t),h={error:t}}return h}const S={name:"_catalogSearch",description:"Search for the specified metadata in SAS Viya.\n      the search is specified as a comma delimited string like libname:casuser,Columns:Make,name:abc\n      Convert string to a query string using these patterns:\n      libname xxx to libname:xxx\n      Column xxx to Column.name:xxx\n      ",parameters:{properties:{metadata:{type:"string",description:"The metadata to return"}},type:"object",required:["metadata"]}},A={name:"_getData",description:"Fetch data from a  table like casuser.cars.\n                To limit the number of rows, specify the limit parameter.\n                If format is true, then the data will be formatted.\n                Use standard where clause to filter the data.\n                To return data in csv format, specify csv = true. Default is false.",parameters:{properties:{table:{type:"string",description:"The table to setup. The form of the table is casuser.cars"},limit:{type:"integer",description:"Fetch only the specified number of rows"},format:{type:"boolean",description:"Format the string - true or false"},where:{type:"string",description:'A where clause like Make eq "Audi"'},csv:{type:"boolean",description:"Return data in csv format - true or false"}},type:"object",required:["table"]}},v={name:"_listSASObjects",description:"list SAS resources like reports, files, folders. Specify the limit parameter to limit the number of items returned",parameters:{properties:{resource:{type:"string",description:"The objecttable to setup. The form of the table is casuser.cars"},limit:{type:"integer",description:"Get this many items"}},type:"object",required:["resource","limit"]}},T={name:"_listSASDataLib",description:"list available SAS libs, calibs, librefs or libraries.\n     This tool is the only one that can answer questions like this.\n\n     A example would be list libs. \n     If limit is not is specified, then the function \n     will return the first 10 libs.\n    ",parameters:{properties:{limit:{type:"integer",description:"Return only this many libs. If not specified, then return 10 libs."},source:{type:"string",description:"The source of the data. cas or compute",enum:["cas","compute"]}},type:"object"}},_={name:"_listSASTables",description:"for a given SAS library, lib, caslibs or libref get the list of available tables.\n    (ex: list tables for Samples)\n    Optionally let user specify the source as cas or compute.",parameters:{properties:{library:{type:"string",description:"A SAS library like casuser, sashelp, samples"},limit:{type:"integer",description:"Return only this many tables. If not specified, then return 10 tables."},source:{type:"string",description:"The source of the data. cas or compute",enum:["cas","compute"]}},type:"object",required:["library"]}},k={name:"_listColumns",description:"Get schema or columns for specified SAS  table. Table is of the form sashelp.cars",parameters:{properties:{table:{type:"string",description:"A table like sashelp.cars"}},type:"object",required:["table"]}},N={name:"_describeTable",description:"Describe the SAS table like sashelp.cars . return information on the table like columns, types, keys. Optionally format the data",parameters:{properties:{table:{type:"string",description:"A table like sashelp.cars"},format:{type:"boolean",description:"If true then format the data"}},type:"object",required:["table"]}},q={name:"_runSAS",description:"run the specified sas program",parameters:{properties:{program:{type:"string",description:"this is the program to run"}},type:"object",required:["program"]}},E={name:"_keywords",description:"format a comma-separated keywords like a,b,c into html, array, object",parameters:{properties:{keywords:{type:"string",description:"A comma-separated list of keywords like a,b,c"},format:{type:"string",enum:["html","array","object"],description:"Format the string"}},type:"object",required:["keywords","format"]}};function I(t,e){let s=t;return"openai"===e&&(s={listAssistants:(t=>(...e)=>{let[s]=e;return t.beta.assistants.list(s)})(t),createAssistant:(t=>(...e)=>{let[s]=e;return t.beta.assistants.create(s)})(t),getAssistant:(t=>(...e)=>{let[s]=e;return t.beta.assistants.retrieve(s)})(t),deleteAssistant:(t=>(...e)=>{let[s]=e;return t.beta.assistants.del(s)})(t),updateAssistant:(t=>(...e)=>{let[s,a]=e;return a.fileIds&&(a.file_ids=a.fileIds,delete a.fileIds),t.beta.assistants.update(s,a)})(t),createThread:(t=>(...e)=>{let[s]=e;return null==s&&(s={}),t.beta.threads.create(s)})(t),getThread:(t=>(...e)=>{let[s]=e;return t.beta.threads.retrieve(s)})(t),deleteThread:(t=>(...e)=>{let[s]=e;return t.beta.threads.del(s)})(t),createMessage:(t=>(...e)=>{let[s,a,n,r]=e,i={role:a,content:n};return null!=r&&(i=Object.assign(i,r)),t.beta.threads.messages.create(s,i)})(t),listMessages:(t=>(...e)=>{let[s,a]=e;return t.beta.threads.messages.list(s,a)})(t),uploadFile:(t=>(...e)=>{let[s,a]=e;return t.files.create({file:s,purpose:a})})(t),createAssistantFile:(t=>(...e)=>{let[s,a]=e,n={file_id:a};return console.log(n),console.log(s),t.beta.assistants.files.create(s,n)})(t),createRun:(t=>(...e)=>{let[s,a]=e;return t.beta.threads.runs.create(s,{assistant_id:a.assistantId,additional_instructions:a.instructions,tools:null!=a.tools?a.tools:[]})})(t),getRun:(t=>(...e)=>{let[s,a]=e;return t.beta.threads.runs.retrieve(s,a)})(t),listRuns:(t=>(...e)=>{let[s]=e;return t.beta.threads.runs.list(s)})(t),cancelRun:(t=>(...e)=>{let[s,a]=e;return t.beta.threads.runs.cancel(s,a)})(t),submitToolOutputsToRun:(t=>(...e)=>{let[s,a,n]=e;return t.beta.threads.runs.submitToolOutputs(s,a,n)})(t)}),s}async function x(i){let{credentials:o}=i,{key:l,endPoint:p}=o,w=null;w="openai"===i.provider?new t({apiKey:l,dangerouslyAllowBrowser:!0}):new e(p,new s(l,{}));let x,O=function(t,e,s){let a=[v,T,_,k,N,S,A,q,E],n=[];a.forEach(t=>{let e={type:"function",function:Object.assign({},t)};n.push(e)});let r={_getData:h,_listSASObjects:c,_listSASTables:f,_listColumns:m,_listSASDataLib:d,_runSAS:g,_keywords:b,_describeTable:y,_catalogSearch:u},i="undefined"==typeof window?(console.log("instructions for node use "),"\n You are a Assistant designed for SAS users. You can help SAS users with their SAS related questions and provide information\n  on topics like libraries(alias of libs, caslibs and libref), reports  and tables. You can also fetch data from then tables and run SAS programs. You can also help answer questions about the \n  data that has been returned from previous queries. Most times the user will be focused on these areas.\n  Always try the provided tools first to find an answer to your question. If the query is not clear then ask the user for clarification before creating a response.\n  Always report always include annotation when information is found in a file.\n  "):(console.log("instructions for web"),"\n You are a Assistant designed for SAS users. You can help SAS users with their SAS related questions and provide information\n  on topics like libraries(alias of libs, caslibs and libref), reports  and tables. You can also fetch data from then tables and run SAS programs. You can also help answer questions about the \n  data that has been returned from previous queries. Most times the user will be focused on these areas. \n  try the provided tools and files first to find an answer to your question. If the query is not clear then ask the user for clarification before creating a response.\n  Always include annotation when information is found in a file\n  Here are some tips for formatting the response from the tools.\n  For example,\n\n  Format the response as a html table if the content of the response is one of the following formats:\n\n  - a comma-delimited format \n  - or of this format [{a:1,b:2},{a:1,b:3},...]\n\n  The html table should have a light blue background for the column headers.Below is a sample html table format.\n  Use a border width of 1px and solid style for the table.\n  '<table>\n     <tr>\n       <th>a</th> \n      <th>b</th>\n     </tr>\n    <tr>\n    <td>1</td>\n    <td>2</td>\n    </tr>\n    <tr>\n   <td>2</td>\n   <td>3</td>\n   </tr>\n   </table>' \n \n  if the response from a tool is of the form  like ['a','b','c', ...] or [1,11,8, ...] then return the data as a html unordered list to the user\n  like this:\n  '<ul>\n    <li>a</li>\n    <li>b</li>\n    <li>3</li>\n  </ul>'\n\n  if the response from a tool is of the form {a:1,b:2} then return the data as a html table with a single column.\n  '<table>\n  <tr>\n  <th>Name</th>\n  <th>Value</th>\n  </tr>\n    <tr>\n      <td>a</td>\n      <td>1</td>\n    </tr>\n    <tr>\n      <td>b</td>\n      <td>1</td>\n    </tr>\n\n  </table>'\n\n if the response from a tool is of the form \n {a: {a1:10, bx:20, c: {cx:3, az: 4}} } then format the message as nested html table. Here is an example:\n\n  '<table>\n  <tr>\n  <th>Name</th>\n  <th>Value</th>\n  </tr>\n  <tr>\n  <td>a</td>\n  <td>\n  <table>\n  <tr>\n  <th>Name</th>\n  <th>Value</th>\n  </tr>\n  <tr>\n  <td>a1</td>\n  <td>10</td>\n  </tr>\n  <tr>\n  <td>bx</td>\n  <td>20</td>\n  </tr>\n  <tr>\n  <td>c</td>\n  <td>\n  <table>\n  <tr>\n  <th>Name</th>\n  <th>Value</th>\n  </tr>\n  <tr>\n  <td>cx</td>\n  <td>3</td>\n  </tr>\n  <tr>\n  <td>az</td>\n  <td>4</td>\n  </tr>\n  </table>\n  </td>\n  </tr>\n  </table>\n  </td>\n  </tr>\n\n  </table>'\n  \n \n  ");return{specs:a,tools:n,functionList:r,instructions:i}}(),C=[],R=i.domainTools.tools;C=R.length>0?O.tools.filter(t=>{let e=R.findIndex((e,s)=>e.function.name===t.function.name);return-1!==e&&console.log("overriding",t.function.name),-1===e}):O.tools,x=!0===i.domainTools.replace?i.domainTools:{tools:C.concat(R),functionList:Object.assign(O.functionList,i.domainTools.functionList),instructions:i.instructions?i.instructions+O.instructions:O.instructions},i.code&&x.tools.push({type:"code_interpreter"}),i.retrieval&&x.tools.push({type:"retrieval"}),console.log(x.instructions);let D={provider:i.provider,model:i.model,domainTools:x,instructions:x.instructions,assistantName:i.assistantName,assistant:null,assistantid:i.assistantid,thread:null,threadid:i.threadid,appEnv:null,client:w,run:null,assistantApi:I(w,i.provider),code:i.code,retrieval:i.retrieval,userData:i.userData,user:i.user};D.appEnv=await async function(t){let e={host:null,logonPayload:null,store:null,source:"none",currentSource:"none",session:null,servers:null,serverName:null,casServerName:null,sessionID:null,compute:{},cas:{},restaf:a,restaflib:n,restafedit:r};if(null==t)return e;if("none"==t.source)return e.userData=t.userData,e.logonPayload=t.logonPayload,e.currentSource="none",e;let{source:s,logonPayload:i}=t,o=s.split(",")[0];e.currentSource=o,e.host=i.host;let l=a.initStore({casProxy:!0});if(await l.logon(i),e.host=i.host,e.logonPayload=i,e.store=l,s.indexOf("cas")>=0){let{session:t,servers:s}=await n.casSetup(l,null),a=t.links("execute","link","server");e.cas={session:t,servers:s,casServerName:a};let r=await l.apiCall(t.links("self"));e.cas.sessionID=r.items("id"),"cas"===o&&(e.source="cas",e.session=t,e.servers=s,e.serverName=a,e.casServerName=a,e.sessionID=e.cas.sessionID)}if(s.indexOf("compute")>=0){e.compute={servers:null};try{let t=await n.computeSetup(l),s=await l.apiCall(e.session.links("self"));e.compute.sessionID=s.items("id"),"compute"===o&&(e.source="compute",e.session=t,e.servers=null,e.serverName=null,e.sessionID=e.compute.sessionID)}catch(t){console.log(JSON.stringify(t,null,4))}}return e}(i.viyaConfig),D.appEnv.userData=i.userData,D.appEnv.user=i.user,D.assistant=await async function(t){let{assistantName:e,model:s,assistantid:a,instructions:n,domainTools:r,assistantApi:i}=t;try{if("NEW"!==a&&"REUSE"!==a)return console.log("Using assistantid ",a),await i.getAssistant(a);let t={name:e,instructions:n,model:s,tools:r.tools};console.log("Attempting to find assistant by name ",e);let o=null;return o=(await i.listAssistants({order:"desc",limit:"100"})).data.find(t=>{if(t.name===e)return t}),null!=o&&"REUSE"===a?(console.log("Found assistant ",e,o.id),o):(null!=o&&(console.log("Deleting old assistant ",e,o.id),await i.deleteAssistant(o.id)),console.log("Creating new assistant"),o=await i.createAssistant(t),o)}catch(t){throw console.log(t),new Error(`Error status ${t.status}. Failed to create assistant. See console for details.`)}}(D),D.thread=await async function(t){let{assistant:e,assistantApi:s}=t,a=null,n=t.threadid,r=e.metadata.lastThread;console.log("loadThread",n,r);try{return"REUSE"!==n&&"NEW"!==n?(console.log("Using threadid ",n),await s.getThread(n)):"REUSE"===n&&null!=r?(console.log("Attempting to use previous ",r),await s.getThread(r)):(null!=r&&(console.log("Deleting last thread",r),await s.deleteThread(r)),console.log("Creating new thread"),a=await s.createThread(),a)}catch(t){throw console.log(t),new Error(`Error status ${t.status}. Failed to create thread. See console for details.`)}return a}(D);let F=await D.assistantApi.updateAssistant(D.assistant.id,{metadata:{lastThread:D.thread.id}});return D.assistant=F,D.threadid=D.thread.id,console.log("--------------------------------------"),console.log("Current session:"),console.log("Provider: ",D.provider),console.log("Model: ",D.model),console.log("Assistant: ",D.assistant.name,"Assistant id",D.assistant.id),console.log("Threadid: ",D.thread.id),console.log("Viya Source:",D.appEnv.source),console.log("--------------------------------------"),D}async function O(t,e){let{thread:s,assistantApi:a}=t;const n=await a.listMessages(s.id,{limit:e});let r=[],i=n.data;for(let t=0;t<n.data.length;t++){let e=i[t].content[0];if("assistant"!==i[t].role)break;console.log("annotations",e[e.type].annotations),r.push({id:i[t].id,role:i[t].role,type:e.type,content:e[e.type].value})}return r.length>1&&(r=r.reverse()),r}async function C(t,e){let{assistantApi:s,thread:a}=e,n=null,r=null;function i(t){return new Promise(e=>setTimeout(e,t))}do{r=await s.getRun(a.id,t.id),console.log("-------------------",r.status),"queued"!==r.status&&"in_progress"!==r.status&&"cancelling"!==r.status?n=r.status:(await i(500),console.log("waited 500 ms"))}while(null===n);return r}function R(t,e,s){return"openai"===s?{tool_call_id:t,output:JSON.stringify(e)}:{toolCallId:t,output:JSON.stringify(e)}}async function D(t,e,s){let{thread:a,assistantApi:n}=t;try{let s={};"openai"===t.provider?s.file_ids=t.assistant.file_ids:s.fileIds=t.assistant.fileIds,await n.createMessage(a.id,"user",e,s)}catch(t){throw console.log(t.status),console.log(t.error),new Error(`\n     Request failed on adding user message to thread.\n     See error below. \n     If thread is active, you can try canceling the run.\n     ${t.status} ${t.error}`)}let r=await async function(t,e,s){let{assistantApi:a,assistant:n,thread:r}=t,i={assistantId:n.id,instructions:null!=s?s:null,tools:n.tools},o=await a.createRun(r.id,i);t.run=o;let l,u=await C(o,t);return"completed"===u.status?l=await O(t,5):"requires_action"===u.status?(await async function(t,e){let{assistantApi:s,appEnv:a,domainTools:n,provider:r,thread:i,run:o}=e,{functionList:l}=n,u="openai"===r?t.required_action.submit_tool_outputs.tool_calls:t.requiredAction.submitToolOutputs.toolCalls,c=[];for(let t of u){let s=t.function.name;console.log("Requested function: ",s);let n=JSON.parse(t.function.arguments);if(null==l[s])c.push(R(t.id,`Function ${s} not found. \n      Probable causes: \n        Using thread that had outdated tool references.\n        Currrent specs point has mistmatch with function name\n        `,r));else try{console.log(">> Calling function: ",s);let i=await l[s](n,a,e);console.log(">> Function call completed"),c.push("openai"===r?{tool_call_id:t.id,output:JSON.stringify(i)}:{toolCallId:t.id,output:JSON.stringify(i)})}catch(e){c.push(R(t.id,e,r))}}let d="openai"===r?await s.submitToolOutputsToRun(i.id,o.id,{tool_outputs:c}):await s.submitToolOutputsToRun(i.id,o.id,c);return await C(d,e)}(u,t),console.log("getting latest message "),l=await O(t,5)):l=[{runStatus:u.status}],l}(t,0,s);return r}async function F(t,e){let{assistantApi:s,assistant:a}=t;if(console.log("in closeAssistant"),null!=e)try{if(null!=e)return await s.deleteAssistant(id),`Assistant ${e} deleted.`}catch(t){throw console.log(t),new Error(`\n        Delete of assistant ${e} failed`)}try{if(null!=a.metadata.lastThread){let e=await s.deleteThread(a.metadata.lastThread);return console.log("Thread ${assistant.metadata.lastThread} deleted",e),e=await s.deleteAssistant(a.id),console.log(`Assistant ${a.name} deleted`,e),t.assistant=null,t.assistantid="0",`Assistant ${a.name} deleted`}}catch(t){throw console.log(t),new Error(`Failed to delete session and thread\n    ${t}`)}}async function j(t,e){let{thread:s,assistantApi:a}=t;return(await a.listMessages(s.id,{limit:e})).data.map(t=>{let e=t.content[0];return{id:t.id,role:t.role,type:e.type,content:e[e.type].value}})}async function $(t,e,s,a,n){let{assistantApi:r,assistant:i,provider:o}=n,l=null;try{l="openai"===o?await r.uploadFile(e,a):await r.uploadFile(s,a,{filename:t}),console.log("uploaded file:",l.id);let u=await r.createAssistantFile(i.id,l.id);return console.log("Assistant File ",u.id),await async function(t,e){let{assistantApi:s,assistant:a,provider:n}=t,r="openai"===n?a.file_ids:a.fileIds;r.push(e.id),r=r.filter(t=>null!=t);try{let e={fileIds:r},n=await s.updateAssistant(a.id,e);t.assistant=n}catch(t){throw console.log(t),new Error(`Failed to update assistant with new file ${e.id}`)}}(n,u),{fileName:t,fileId:l.id,assistantFileId:u.id}}catch(e){throw console.log(e),new Error(`Failed to upload file ${t}`)}}async function J(t,e,s){let{assistantApi:a,assistant:n,thread:r,run:i}=t;if(null!=e&&null!=s)try{return console.log("Cancelling run",e,s),await a.cancelRun(e,s)}catch(t){throw s}if(null==i||null==r)return"No run or thread to cancel";try{let t=await a.getRun(r.id,i.id);return null!==t.completed||"cancelling"===t.status?`Run ${i.id} status: ${t.status} , completed: ${t.completed}`:await a.cancelRun(r.id,i.id)}catch(t){throw new Error(`\n    Cancel run failed.  \n    Best action is to simply wait for a while for it to timeout \n    The last alternative is to delete the Assistant ${n.name} and restart your session`)}}export{J as cancelRun,F as deleteAssistant,O as getLatestMessage,j as getMessages,D as runAssistant,x as setupAssistant,$ as uploadFile};
//# sourceMappingURL=index.modern.js.map
