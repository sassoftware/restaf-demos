import t from"openai";import{AssistantsClient as e,AzureKeyCredential as n}from"@azure/openai-assistants";import r from"@sassoftware/restaf";import s from"@sassoftware/restaflib";import o from"@sassoftware/restafedit";function i(t){var e=[];return t.map(function(t){var n=t.line.replace(/(\r\n|\n|\r)/gm,"");e.push(0===n.length?"   ":n)}),e}function a(t,e){var n={},r="cas"===e?"caslib":"libref",s=t.split(".");return 2===s.length?(n[r]=s[0],n.name=s[1],n):null}function l(t){if(0===t.length)return"";var e=Object.keys(t[0]).filter(function(t){return!("_rowIndex"===t||"_modified"===t)}).join(",")+"\n",n="";return t.map(function(t){var e,r="",s="";for(var o in t)"_rowIndex"!==o&&"_modified"!==o&&(r=r+s+("."==(e=t[o])||null==e?"":"string"==typeof e?(e=e.replace(/"/g,'""')).trim():e.toString()),s=",");n=n+r+"\n"}),e+n}function u(t,e){try{var n=t()}catch(t){return e(t)}return n&&n.then?n.then(void 0,e):n}var c=function(t,e){try{var n=t.table,r=t.limit,s=t.format,o=t.where,i=t.csv,c=e.source,d=e.sessionID,f=e.restafedit;i=null!=i&&i,console.log(t);var h=a(n,c);return null===h?Promise.resolve("Table must be specified in the form casuser.cars or sashelp.cars"):Promise.resolve(f.setup(e.logonPayload,{source:c,table:h,casServerName:e.casServerName,computeContext:e.computeContext,initialFetch:{qs:{start:0,limit:null==r?2:r,format:null!=s&&s,where:null==o?"":o}}},d)).then(function(t){var e={},n=u(function(){return Promise.resolve(f.scrollTable("first",t)).then(function(){return Promise.resolve(f.getTableSummary(t)).then(function(n){e={table:h,tableSummary:n,columns:t.state.columns,data:!1!==i?t.state.data:l(t.state.data)}})})},function(t){console.log(t),e={error:t}});return n&&n.then?n.then(function(){return e}):e})}catch(t){return Promise.reject(t)}},d=function(t,e){return Promise.resolve(c(t,e)).then(function(t){return JSON.stringify(t,null,4)})},f=function(t){try{var e=t.keywords,n=t.format;switch(console.log("keywords",e,n),n){case"html":var r="<ul>";return e.split(",").forEach(function(t){r+="<li>"+t+"</li>"}),r+="</ul>",Promise.resolve(r);case"array":return Promise.resolve(e.split(","));case"object":var s={};return e.split(",").forEach(function(t,e){s["key"+e]=t}),Promise.resolve(s);default:return Promise.resolve(t)}}catch(t){return Promise.reject(t)}},h=function(t,e,n){try{var r=t.program,s=e.store,o=e.session,a=e.restaflib;return Promise.resolve(u(function(){return"cas"===e.source?Promise.resolve(a.caslRun(s,o,r,{},!0)).then(function(t){return JSON.stringify(t.results,null,4)}):e?Promise.resolve(computeRun(s,o,src)).then(function(t){return Promise.resolve(a.computeResults(s,t,"log")).then(i)}):"Cannot run program without a session"},function(t){return console.log(t),"Error running program "+r}))}catch(t){return Promise.reject(t)}},m=function(t,e){return Promise.resolve(c(t,e)).then(function(t){return JSON.stringify({table:t.table,data:t.data},null,4)})},v=function(t,e){try{return null===a(t.table,e.source)?Promise.resolve("Table must be specified in the form casuser.cars or sashelp.cars"):Promise.resolve(e.restafedit.getTableList(library,e,p)).then(function(t){return JSON.stringify(t,null,4)})}catch(t){return Promise.reject(t)}},b=function(t,e){try{var n=t.limit;return Promise.resolve(e.restafedit.getTableList(t.library,e,{qs:{limit:null==n?10:n,start:0}})).then(function(t){return JSON.stringify(t,null,4)})}catch(t){return Promise.reject(t)}},g=function(t,e){try{var n=t.limit,r=t.start;return Promise.resolve(e.restafedit.getLibraryList(e,{qs:{limit:null==n?10:n,start:null==r?0:r}})).then(function(t){return JSON.stringify(t,null,4)})}catch(t){return Promise.reject(t)}},y=function(t,e){try{var n=t.resource,r=t.limit,s=e.store;return r=null==r?10:r,!1===["files","folders","reports"].includes(n.toLowerCase())?Promise.resolve("{Error: 'resource "+n+" is not supported at this time'}"):Promise.resolve(s.addServices(n)).then(function(t){var e={qs:{limit:r,start:0}};return Promise.resolve(s.apiCall(t[n].links(n),e)).then(function(t){var e=t.itemsList();return JSON.stringify(e,null,4)})})}catch(t){return Promise.reject(t)}},P=function(t,e,n){try{var r=t.metadata,s=e.store;return console.log("metadata",r),Promise.resolve(u(function(){return Promise.resolve(s.addServices("catalog")).then(function(t){var e={qs:{q:r}};return Promise.resolve(s.apiCall(t.catalog.links("search"),e)).then(function(t){return JSON.stringify(t.items(),null,4)})})},function(t){return console.log(JSON.stringify(t)),"Error searching catalog"}))}catch(t){return Promise.reject(t)}},w={name:"_catalogSearch",description:"Search for the specified metadata in SAS Viya.\n      the search is specified as a comma delimited string like libname:casuser,Columns:Make,name:abc\n      Convert string to a query string using these patterns:\n      libname xxx to libname:xxx\n      Column xxx to Column.name:xxx\n      \n      ",parameters:{properties:{metadata:{type:"string",description:"The metadata to return"}},type:"object",required:["metadata"]}},S={name:"_getData",description:"Fetch data from a  table like casuser.cars.\n                To limit the number of rows, specify the limit parameter.\n                If format is true, then the data will be formatted.\n                Use standard where clause to filter the data.\n                To return data in csv format, specify csv = true. Default is false.",parameters:{properties:{table:{type:"string",description:"The table to setup. The form of the table is casuser.cars"},limit:{type:"integer",description:"Fetch only the specified number of rows"},format:{type:"boolean",description:"Format the string - true or false"},where:{type:"string",description:'A where clause like Make eq "Audi"'},csv:{type:"boolean",description:"Return data in csv format - true or false"}},type:"object",required:["table"]}},A={name:"_listSASObjects",description:"list SAS resources like reports, files, folders. Specify the limit parameter to limit the number of items returned",parameters:{properties:{resource:{type:"string",description:"The objecttable to setup. The form of the table is casuser.cars"},limit:{type:"integer",description:"Get this many items"}},type:"object",required:["resource","limit"]}},T={name:"_listSASDataLib",description:"list available SAS libs, calibs, librefs or libraries.\n     This tool is the only one that can answer questions like this.\n\n     A example would be list libs. \n     If limit is not is specified, then the function \n     will return the first 10 libs.\n    ",parameters:{properties:{limit:{type:"integer",description:"Return only this many libs. If not specified, then return 10 libs."},source:{type:"string",description:"The source of the data. cas or compute",enum:["cas","compute"]}},type:"object"}},j={name:"_listSASTables",description:"for a given SAS library, lib, caslibs or libref get the list of available tables.\n    (ex: list tables for Samples)\n    Optionally let user specify the source as cas or compute.",parameters:{properties:{library:{type:"string",description:"A SAS library like casuser, sashelp, samples"},limit:{type:"integer",description:"Return only this many tables. If not specified, then return 10 tables."},source:{type:"string",description:"The source of the data. cas or compute",enum:["cas","compute"]}},type:"object",required:["library"]}},k={name:"_listColumns",description:"Get schema or columns for specified SAS  table. Table is of the form sashelp.cars",parameters:{properties:{table:{type:"string",description:"A table like sashelp.cars"}},type:"object",required:["table"]}},x={name:"_describeTable",description:"Describe the SAS table like sashelp.cars . return information on the table like columns, types, keys. Optionally format the data",parameters:{properties:{table:{type:"string",description:"A table like sashelp.cars"},format:{type:"boolean",description:"If true then format the data"}},type:"object",required:["table"]}},_={name:"_runSAS",description:"run the specified sas program",parameters:{properties:{program:{type:"string",description:"this is the program to run"}},type:"object",required:["program"]}},N={name:"_keywords",description:"format a comma-separated keywords like a,b,c into html, array, object",parameters:{properties:{keywords:{type:"string",description:"A comma-separated list of keywords like a,b,c"},format:{type:"string",enum:["html","array","object"],description:"Format the string"}},type:"object",required:["keywords","format"]}};function q(t,e){var n=t;return"openai"===e&&(n={listAssistants:function(t){return function(){var e=[].slice.call(arguments);return t.beta.assistants.list(e[0])}}(t),createAssistant:function(t){return function(){var e=[].slice.call(arguments);return t.beta.assistants.create(e[0])}}(t),getAssistant:function(t){return function(){var e=[].slice.call(arguments);return t.beta.assistants.retrieve(e[0])}}(t),deleteAssistant:function(t){return function(){var e=[].slice.call(arguments);return t.beta.assistants.del(e[0])}}(t),updateAssistant:function(t){return function(){var e=[].slice.call(arguments),n=e[0],r=e[1];return r.fileIds&&(r.file_ids=r.fileIds,delete r.fileIds),t.beta.assistants.update(n,r)}}(t),createThread:function(t){return function(){var e=[].slice.call(arguments)[0];return null==e&&(e={}),t.beta.threads.create(e)}}(t),getThread:function(t){return function(){var e=[].slice.call(arguments);return t.beta.threads.retrieve(e[0])}}(t),deleteThread:function(t){return function(){var e=[].slice.call(arguments);return t.beta.threads.del(e[0])}}(t),createMessage:function(t){return function(){var e=[].slice.call(arguments),n=e[0],r=e[3],s={role:e[1],content:e[2]};return null!=r&&(s=Object.assign(s,r)),t.beta.threads.messages.create(n,s)}}(t),listMessages:function(t){return function(){var e=[].slice.call(arguments);return t.beta.threads.messages.list(e[0],e[1])}}(t),uploadFile:function(t){return function(){var e=[].slice.call(arguments);return t.files.create({file:e[0],purpose:e[1]})}}(t),createAssistantFile:function(t){return function(){var e=[].slice.call(arguments),n=e[0],r={file_id:e[1]};return console.log(r),console.log(n),t.beta.assistants.files.create(n,r)}}(t),createRun:function(t){return function(){var e=[].slice.call(arguments),n=e[1];return t.beta.threads.runs.create(e[0],{assistant_id:n.assistantId,additional_instructions:n.instructions,tools:null!=n.tools?n.tools:[]})}}(t),getRun:function(t){return function(){var e=[].slice.call(arguments);return t.beta.threads.runs.retrieve(e[0],e[1])}}(t),listRuns:function(t){return function(){var e=[].slice.call(arguments);return t.beta.threads.runs.list(e[0])}}(t),cancelRun:function(t){return function(){var e=[].slice.call(arguments);return t.beta.threads.runs.cancel(e[0],e[1])}}(t),submitToolOutputsToRun:function(t){return function(){var e=[].slice.call(arguments);return t.beta.threads.runs.submitToolOutputs(e[0],e[1],e[2])}}(t)}),n}var E=function(i){try{var a,l=i.credentials,u=l.key,c=l.endPoint;a="openai"===i.provider?new t({apiKey:u,dangerouslyAllowBrowser:!0}):new e(c,new n(u,{}));var p,E=function(t,e,n){var r=[A,T,j,k,x,w,S,_,N],s=[];r.forEach(function(t){var e={type:"function",function:Object.assign({},t)};s.push(e)});var o={_getData:m,_listSASObjects:y,_listSASTables:b,_listColumns:v,_listSASDataLib:g,_runSAS:h,_keywords:f,_describeTable:d,_catalogSearch:P},i="undefined"==typeof window?(console.log("instructions for node use "),"\n You are a Assistant designed for SAS users. You can help SAS users with their SAS related questions and provide information\n  on topics like libraries(alias of libs, caslibs and libref), reports  and tables. You can also fetch data from then tables and run SAS programs. You can also help answer questions about the \n  data that has been returned from previous queries. Most times the user will be focused on these areas.\n  Always try the provided tools first to find an answer to your question. If the query is not clear then ask the user for clarification before creating a response.\n  Always report always include annotation when information is found in a file.\n  "):(console.log("instructions for web"),"\n You are a Assistant designed for SAS users. You can help SAS users with their SAS related questions and provide information\n  on topics like libraries(alias of libs, caslibs and libref), reports  and tables. You can also fetch data from then tables and run SAS programs. You can also help answer questions about the \n  data that has been returned from previous queries. Most times the user will be focused on these areas. \n  try the provided tools and files first to find an answer to your question. If the query is not clear then ask the user for clarification before creating a response.\n  Always include annotation when information is found in a file\n  Here are some tips for formatting the response from the tools.\n  For example,\n\n  Format the response as a html table if the content of the response is one of the following schema:\n\n  - a comma-delimited format \n  - or of this schema [{a:1,b:2},{a:1,b:3},...]\n  - or of this schema{a: {a1:10, bx:20, c: {cx:3, az: 4}} }, {d: {d1:10, d2:20},...}\n\n  Below is an example of a  html table format with nested table\n\n      '<table>     \n         <tr>     \n           <th>Name</th>     \n           <th>Value</th>     \n         </tr>     \n         <tr>     \n           <td>a</td>     \n           <td>     \n             <table>     \n               <tr>     \n                 <th>Name</th>     \n                 <th>Value</th>     \n               </tr>     \n               <tr>     \n                 <td>a1</td>     \n                 <td>10</td>     \n               </tr>     \n               <tr>     \n                 <td>bx</td>     \n                 <td>20</td>     \n               </tr>     \n               <tr>     \n                 <td>c</td>     \n                 <td>     \n                   <table>     \n                     <tr>     \n                       <th>Name</th>     \n                       <th>Value</th>     \n                     </tr>     \n                     <tr>     \n                       <td>cx</td>     \n                       <td>3</td>     \n                     </tr>     \n                     <tr>     \n                       <td>az</td>     \n                       <td>4</td>     \n                     </tr>     \n                   </table>     \n                 </td>     \n               </tr>     \n             </table>     \n           </td>     \n         </tr>     \n         <tr>     \n           <td>d</td>     \n           <td>     \n             <table>     \n               <tr>     \n                 <th>Name</th>     \n                 <th>Value</th>     \n               </tr>     \n               <tr>     \n                 <td>d1</td>     \n                 <td>10</td>     \n               </tr>     \n               <tr>     \n                 <td>d2</td>     \n                 <td>20</td>     \n               </tr>     \n             </table>     \n           </td>     \n         </tr>     \n       </table>     \n     '\n\n  if the response from a tool is of the form  like ['a','b','c', ...] or [1,11,8, ...] then format it as  html unordered list element\n  Below is a sample html unordered list format.\n  '<ul>\n    <li>a</li>\n    <li>b</li>\n    <li>3</li>\n  </ul>'\n\n  if the response from a tool is of the form {a:1,b:2} then format it as  html table with a single column.\n  '<table>\n  <tr>\n  <th>Name</th>\n  <th>Value</th>\n  </tr>\n    <tr>\n      <td>a</td>\n      <td>1</td>\n    </tr>\n    <tr>\n      <td>b</td>\n      <td>1</td>\n    </tr>\n\n  </table>'\n\n  The suggested styling for the html table is as follows:\n    The html table should have a light blue background for the column headers.\n    Use a border width of 1px and solid style for the table.\n");return{specs:r,tools:s,functionList:o,instructions:i}}(),I=[],O=i.domainTools.tools;I=O.length>0?E.tools.filter(function(t){var e=O.findIndex(function(e,n){return e.function.name===t.function.name});return-1!==e&&console.log("overriding",t.function.name),-1===e}):E.tools,p=!0===i.domainTools.replace?i.domainTools:{tools:I.concat(O),functionList:Object.assign(E.functionList,i.domainTools.functionList),instructions:i.instructions?i.instructions+E.instructions:E.instructions},i.code&&p.tools.push({type:"code_interpreter"}),i.retrieval&&p.tools.push({type:"retrieval"}),console.log(p.instructions);var C={provider:i.provider,model:i.model,domainTools:p,instructions:p.instructions,assistantName:i.assistantName,assistant:null,assistantid:i.assistantid,thread:null,threadid:i.threadid,appEnv:null,client:a,run:null,assistantApi:q(a,i.provider),code:i.code,retrieval:i.retrieval,userData:i.userData,user:i.user};return Promise.resolve(function(t){try{var e={host:null,logonPayload:null,store:null,source:"none",currentSource:"none",session:null,servers:null,serverName:null,casServerName:null,sessionID:null,compute:{},cas:{},restaf:r,restaflib:s,restafedit:o};if(null==t)return Promise.resolve(e);if("none"==t.source)return e.userData=t.userData,e.logonPayload=t.logonPayload,e.currentSource="none",Promise.resolve(e);var n=t.source,i=t.logonPayload,a=n.split(",")[0];e.currentSource=a,e.host=i.host;var l=r.initStore({casProxy:!0});return Promise.resolve(l.logon(i)).then(function(){function t(){var t=function(){if(n.indexOf("compute")>=0){e.compute={servers:null};var t=function(t,n){try{var r=Promise.resolve(s.computeSetup(l)).then(function(t){return Promise.resolve(l.apiCall(e.session.links("self"))).then(function(n){e.compute.sessionID=n.items("id"),"compute"===a&&(e.source="compute",e.session=t,e.servers=null,e.serverName=null,e.sessionID=e.compute.sessionID)})})}catch(t){return n(t)}return r&&r.then?r.then(void 0,n):r}(0,function(t){console.log(JSON.stringify(t,null,4))});if(t&&t.then)return t.then(function(){})}}();return t&&t.then?t.then(function(){return e}):e}e.host=i.host,e.logonPayload=i,e.store=l;var r=function(){if(n.indexOf("cas")>=0)return Promise.resolve(s.casSetup(l,null)).then(function(t){var n=t.session,r=t.servers,s=n.links("execute","link","server");return e.cas={session:n,servers:r,casServerName:s},Promise.resolve(l.apiCall(n.links("self"))).then(function(t){e.cas.sessionID=t.items("id"),"cas"===a&&(e.source="cas",e.session=n,e.servers=r,e.serverName=s,e.casServerName=s,e.sessionID=e.cas.sessionID)})})}();return r&&r.then?r.then(t):t()})}catch(t){return Promise.reject(t)}}(i.viyaConfig)).then(function(t){return C.appEnv=t,C.appEnv.userData=i.userData,C.appEnv.user=i.user,Promise.resolve(function(t){try{var e,n=t.assistantName,r=t.model,s=t.assistantid,o=t.instructions,i=t.domainTools,a=t.assistantApi;return Promise.resolve(function(t,l){try{var u=function(){function t(t){if(e)return t;var l={name:n,instructions:o,model:r,tools:i.tools};console.log("Attempting to find assistant by name ",n);var u=null;return Promise.resolve(a.listAssistants({order:"desc",limit:"100"})).then(function(t){function e(){return console.log("Creating new assistant"),Promise.resolve(a.createAssistant(l)).then(function(t){return u=t})}if(null!=(u=t.data.find(function(t){if(t.name===n)return t}))&&"REUSE"===s)return console.log("Found assistant ",n,u.id),u;var r=function(){if(null!=u)return console.log("Deleting old assistant ",n,u.id),Promise.resolve(a.deleteAssistant(u.id)).then(function(){})}();return r&&r.then?r.then(e):e()})}var l=function(){if("NEW"!==s&&"REUSE"!==s)return console.log("Using assistantid ",s),Promise.resolve(a.getAssistant(s)).then(function(t){return e=1,t})}();return l&&l.then?l.then(t):t(l)}()}catch(t){return l(t)}return u&&u.then?u.then(void 0,l):u}(0,function(t){throw console.log(t),new Error("Error status "+t.status+". Failed to create assistant. See console for details.")}))}catch(t){return Promise.reject(t)}}(C)).then(function(t){return C.assistant=t,Promise.resolve(function(t){try{var e,n=t.assistantApi,r=null,s=t.threadid,o=t.assistant.metadata.lastThread;console.log("loadThread",s,o);var i=function(t,i){try{var a=function(){function t(t){var i;if(e)return t;function a(t){if(i)return t;function e(){return console.log("Creating new thread"),Promise.resolve(n.createThread()).then(function(t){return r=t})}var s=function(){if(null!=o)return console.log("Deleting last thread",o),Promise.resolve(n.deleteThread(o)).then(function(){})}();return s&&s.then?s.then(e):e()}var l=function(){if("REUSE"===s&&null!=o)return console.log("Attempting to use previous ",o),Promise.resolve(n.getThread(o)).then(function(t){return i=1,t})}();return l&&l.then?l.then(a):a(l)}var i=function(){if("REUSE"!==s&&"NEW"!==s)return console.log("Using threadid ",s),Promise.resolve(n.getThread(s)).then(function(t){return e=1,t})}();return i&&i.then?i.then(t):t(i)}()}catch(t){return i(t)}return a&&a.then?a.then(void 0,i):a}(0,function(t){throw console.log(t),new Error("Error status "+t.status+". Failed to create thread. See console for details.")});return Promise.resolve(i&&i.then?i.then(function(){return r}):r)}catch(t){return Promise.reject(t)}}(C)).then(function(t){return C.thread=t,Promise.resolve(C.assistantApi.updateAssistant(C.assistant.id,{metadata:{lastThread:C.thread.id}})).then(function(t){return C.assistant=t,C.threadid=C.thread.id,console.log("--------------------------------------"),console.log("Current session:"),console.log("Provider: ",C.provider),console.log("Model: ",C.model),console.log("Assistant: ",C.assistant.name,"Assistant id",C.assistant.id),console.log("Threadid: ",C.thread.id),console.log("Viya Source:",C.appEnv.source),console.log("--------------------------------------"),C})})})})}catch(t){return Promise.reject(t)}},I=function(t,e){try{return Promise.resolve(t.assistantApi.listMessages(t.thread.id,{limit:e})).then(function(t){for(var e=[],n=t.data,r=0;r<t.data.length;r++){var s=n[r].content[0];if("assistant"!==n[r].role)break;console.log("annotations",s[s.type].annotations),e.push({id:n[r].id,role:n[r].role,type:s.type,content:s[s.type].value})}return e.length>1&&(e=e.reverse()),e})}catch(t){return Promise.reject(t)}};function O(t,e,n){if(!t.s){if(n instanceof R){if(!n.s)return void(n.o=O.bind(null,t,e));1&e&&(e=n.s),n=n.v}if(n&&n.then)return void n.then(O.bind(null,t,e),O.bind(null,t,2));t.s=e,t.v=n;var r=t.o;r&&r(t)}}var C=function(t,e){try{var n=e.assistantApi,r=e.thread,s=null,o=null,i=function(t,e){var n;do{var r=t();if(r&&r.then){if(!D(r)){n=!0;break}r=r.v}var s=e();if(D(s)&&(s=s.v),!s)return r}while(!s.then);var o=new R,i=O.bind(null,o,2);return(n?r.then(a):s.then(l)).then(void 0,i),o;function a(n){for(r=n;D(s=e())&&(s=s.v),s;){if(s.then)return void s.then(l).then(void 0,i);if((r=t())&&r.then){if(!D(r))return void r.then(a).then(void 0,i);r=r.v}}O(o,1,r)}function l(n){if(n){do{if((r=t())&&r.then){if(!D(r))return void r.then(a).then(void 0,i);r=r.v}if(D(n=e())&&(n=n.v),!n)return void O(o,1,r)}while(!n.then);n.then(l).then(void 0,i)}else O(o,1,r)}}(function(){return Promise.resolve(n.getRun(r.id,t.id)).then(function(t){o=t,console.log("-------------------",o.status);var e=function(){if("queued"===o.status||"in_progress"===o.status||"cancelling"===o.status)return Promise.resolve(new Promise(function(t){return setTimeout(t,500)})).then(function(){console.log("waited 500 ms")});s=o.status}();if(e&&e.then)return e.then(function(){})})},function(){return null===s});return Promise.resolve(i&&i.then?i.then(function(){return o}):o)}catch(t){return Promise.reject(t)}};const R=/*#__PURE__*/function(){function t(){}return t.prototype.then=function(e,n){const r=new t,s=this.s;if(s){const t=1&s?e:n;if(t){try{O(r,1,t(this.v))}catch(t){O(r,2,t)}return r}return this}return this.o=function(t){try{const s=t.v;1&t.s?O(r,1,e?e(s):s):n?O(r,1,n(s)):O(r,2,s)}catch(t){O(r,2,t)}},r},t}();function D(t){return t instanceof R&&1&t.s}const F="undefined"!=typeof Symbol?Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator")):"@@iterator";function J(t,e,n){if(!t.s){if(n instanceof L){if(!n.s)return void(n.o=J.bind(null,t,e));1&e&&(e=n.s),n=n.v}if(n&&n.then)return void n.then(J.bind(null,t,e),J.bind(null,t,2));t.s=e,t.v=n;var r=t.o;r&&r(t)}}var L=/*#__PURE__*/function(){function t(){}return t.prototype.then=function(e,n){var r=new t,s=this.s;if(s){var o=1&s?e:n;if(o){try{J(r,1,o(this.v))}catch(t){J(r,2,t)}return r}return this}return this.o=function(t){try{var s=t.v;1&t.s?J(r,1,e?e(s):s):n?J(r,1,n(s)):J(r,2,s)}catch(t){J(r,2,t)}},r},t}();function V(t){return t instanceof L&&1&t.s}function M(t,e,n){return"openai"===n?{tool_call_id:t,output:JSON.stringify(e)}:{toolCallId:t,output:JSON.stringify(e)}}var U=function(t,e,n){try{var r=function(e){return Promise.resolve(function(t,e,n){try{var r=t.assistantApi,s=t.assistant,o=t.thread;console.log(n);var i={assistantId:s.id,instructions:z(n),tools:s.tools};return Promise.resolve(r.createRun(o.id,i)).then(function(e){return t.run=e,Promise.resolve(C(e,t)).then(function(e){var n,r=function(){if("completed"===e.status)return Promise.resolve(I(t,5)).then(function(t){n=t});var r=function(){if("requires_action"===e.status)return Promise.resolve(function(t,e){try{var n=function(){return Promise.resolve(r.submitToolOutputsToRun(i.id,a.id,"openai"===o?{tool_outputs:u}:u)).then(function(t){return Promise.resolve(C(t,e))})},r=e.assistantApi,s=e.appEnv,o=e.provider,i=e.thread,a=e.run,l=e.domainTools.functionList,u=[],c=function(t,e,n){if("function"==typeof t[F]){var r,s,o,i=t[F]();if(function t(n){try{for(;!(r=i.next()).done;)if((n=e(r.value))&&n.then){if(!V(n))return void n.then(t,o||(o=J.bind(null,s=new L,2)));n=n.v}s?J(s,1,n):s=n}catch(t){J(s||(s=new L),2,t)}}(),i.return){var a=function(t){try{r.done||i.return()}catch(t){}return t};if(s&&s.then)return s.then(a,function(t){throw a(t)});a()}return s}if(!("length"in t))throw new TypeError("Object is not iterable");for(var l=[],u=0;u<t.length;u++)l.push(t[u]);return function(t,e,n){var r,s,o=-1;return function n(i){try{for(;++o<t.length;)if((i=e(o))&&i.then){if(!V(i))return void i.then(n,s||(s=J.bind(null,r=new L,2)));i=i.v}r?J(r,1,i):r=i}catch(t){J(r||(r=new L),2,t)}}(),r}(l,function(t){return e(l[t])})}("openai"===o?t.required_action.submit_tool_outputs.tool_calls:t.requiredAction.submitToolOutputs.toolCalls,function(t){var n=t.function.name;console.log("Requested function: ",n);var r=JSON.parse(t.function.arguments),i=l[n],a=function(){if(null==i)u.push(M(t.id,"Function "+n+" not found. \n      Probable causes: \n        Using thread that had outdated tool references.\n        Currrent specs point has mistmatch with function name\n        ",o));else{var a=function(i,a){try{var c=(console.log(">> Calling function: ",n),Promise.resolve(l[n](r,s,e)).then(function(e){console.log(">> Function call completed"),u.push("openai"===o?{tool_call_id:t.id,output:JSON.stringify(e)}:{toolCallId:t.id,output:JSON.stringify(e)})}))}catch(t){return a(t)}return c&&c.then?c.then(void 0,a):c}(0,function(e){u.push(M(t.id,e,o))});if(a&&a.then)return a.then(function(){})}}();if(a&&a.then)return a.then(function(){})});return Promise.resolve(c&&c.then?c.then(n):n())}catch(t){return Promise.reject(t)}}(e,t)).then(function(e){return console.log("getting latest message "),Promise.resolve(I(t,5)).then(function(t){n=t})});n=[{runStatus:e.status}]}();return r&&r.then?r.then(function(){}):void 0}();return r&&r.then?r.then(function(){return n}):n})})}catch(t){return Promise.reject(t)}}(t,0,n))},s=t.thread,o=t.assistantApi,i=function(n,r){try{var i=(a={},"openai"===t.provider?a.file_ids=t.assistant.file_ids:a.fileIds=t.assistant.fileIds,Promise.resolve(o.createMessage(s.id,"user",e,a)).then(function(){}))}catch(t){return r(t)}var a;return i&&i.then?i.then(void 0,r):i}(0,function(t){throw console.log(t.status),console.log(t.error),new Error("\n     Request failed on adding user message to thread.\n     See error below. \n     If thread is active, you can try canceling the run.\n     "+t.status+" "+t.error)});return Promise.resolve(i&&i.then?i.then(r):r())}catch(t){return Promise.reject(t)}};function z(t){var e="\n  \n  Format the response as a html table if the content of the response is one of the following schema:\n\n  - a comma-delimited format \n  - this schema{a: {a1:10, bx:20, c: {cx:3, az: 4}} }, {d: {d1:10, d2:20},...}\n  - this schema [{a1:1,b1:1}, {a1:1, b1:2}. ...}]\n  \n\n  Below is an example of a  html table format with nested table\n\n      '<table>     \n         <tr>     \n           <th>Name</th>     \n           <th>Value</th>     \n         </tr>     \n         <tr>     \n           <td>a</td>     \n           <td>     \n             <table>     \n               <tr>     \n                 <th>Name</th>     \n                 <th>Value</th>     \n               </tr>     \n               <tr>     \n                 <td>a1</td>     \n                 <td>10</td>     \n               </tr>     \n               <tr>     \n                 <td>bx</td>     \n                 <td>20</td>     \n               </tr>     \n               <tr>     \n                 <td>c</td>     \n                 <td>     \n                   <table>     \n                     <tr>     \n                       <th>Name</th>     \n                       <th>Value</th>     \n                     </tr>     \n                     <tr>     \n                       <td>cx</td>     \n                       <td>3</td>     \n                     </tr>     \n                     <tr>     \n                       <td>az</td>     \n                       <td>4</td>     \n                     </tr>     \n                   </table>     \n                 </td>     \n               </tr>     \n             </table>     \n           </td>     \n         </tr>     \n         <tr>     \n           <td>d</td>     \n           <td>     \n             <table>     \n               <tr>     \n                 <th>Name</th>     \n                 <th>Value</th>     \n               </tr>     \n               <tr>     \n                 <td>d1</td>     \n                 <td>10</td>     \n               </tr>     \n               <tr>     \n                 <td>d2</td>     \n                 <td>20</td>     \n               </tr>     \n             </table>     \n           </td>     \n         </tr>     \n       </table>     \n     '\n\n  if the response from a tool is of the form  like ['a','b','c', ...] or [1,11,8, ...] or\n  ['- a','- b','- c', ...] or ['1. xxx', '2. yyy', '3. zzz']\n  then format it as  html ordered or unordered list element\n  Below is a sample html list format.\n  '<ul>\n    <li>a</li>\n    <li>b</li>\n    <li>3</li>\n  </ul>'\n\n\n  if the response from a tool is of the form {a:1,b:2} then format it as  html table with a single column.\n  '<table>\n  <tr>\n  <th>Name</th>\n  <th>Value</th>\n  </tr>\n    <tr>\n      <td>a</td>\n      <td>1</td>\n    </tr>\n    <tr>\n      <td>b</td>\n      <td>1</td>\n    </tr>\n\n  </table>'\n\n  The suggested styling for the html table is as follows:\n    The html table should have a light blue background for the column headers.\n    Use a border width of 1px and solid style for the table.\n\n  \n  ";return null!=t&&(e=t+e),e}function Y(t,e){try{var n=t()}catch(t){return e(t)}return n&&n.then?n.then(void 0,e):n}var B=function(t,e){try{var n,r=function(e){return n?e:Y(function(){if(null!=o.metadata.lastThread)return Promise.resolve(s.deleteThread(o.metadata.lastThread)).then(function(e){return console.log("Thread ${assistant.metadata.lastThread} deleted",e),Promise.resolve(s.deleteAssistant(o.id)).then(function(n){return e=n,console.log("Assistant "+o.name+" deleted",e),t.assistant=null,t.assistantid="0","Assistant "+o.name+" deleted"})})},function(t){throw console.log(t),new Error("Failed to delete session and thread\n    "+t)})},s=t.assistantApi,o=t.assistant;console.log("in closeAssistant");var i=function(){if(null!=e)return Y(function(){if(null!=e)return Promise.resolve(s.deleteAssistant(id)).then(function(){return n=1,"Assistant "+e+" deleted."})},function(t){throw console.log(t),new Error("\n        Delete of assistant "+e+" failed")})}();return Promise.resolve(i&&i.then?i.then(r):r(i))}catch(t){return Promise.reject(t)}},G=function(t,e){try{return Promise.resolve(t.assistantApi.listMessages(t.thread.id,{limit:e})).then(function(t){return t.data.map(function(t){var e=t.content[0];return{id:t.id,role:t.role,type:e.type,content:e[e.type].value}})})}catch(t){return Promise.reject(t)}};function W(t,e){try{var n=t()}catch(t){return e(t)}return n&&n.then?n.then(void 0,e):n}var H=function(t,e,n,r,s){try{var o=s.assistantApi,i=s.assistant,a=s.provider,l=null;return Promise.resolve(W(function(){return Promise.resolve("openai"===a?o.uploadFile(e,r):o.uploadFile(n,r,{filename:t})).then(function(e){return l=e,console.log("uploaded file:",l.id),Promise.resolve(o.createAssistantFile(i.id,l.id)).then(function(e){return console.log("Assistant File ",e.id),Promise.resolve(function(t,e){try{var n=t.assistantApi,r=t.assistant,s="openai"===t.provider?r.file_ids:r.fileIds;return s.push(e.id),s=s.filter(function(t){return null!=t}),Promise.resolve(W(function(){return Promise.resolve(n.updateAssistant(r.id,{fileIds:s})).then(function(e){t.assistant=e})},function(t){throw console.log(t),new Error("Failed to update assistant with new file "+e.id)}))}catch(t){return Promise.reject(t)}}(s,e)).then(function(){return{fileName:t,fileId:l.id,assistantFileId:e.id}})})})},function(e){throw console.log(e),new Error("Failed to upload file "+t)}))}catch(t){return Promise.reject(t)}};function K(t,e){try{var n=t()}catch(t){return e(t)}return n&&n.then?n.then(void 0,e):n}var $=function(t,e,n){try{var r,s=function(t){return r?t:null==l||null==a?"No run or thread to cancel":K(function(){return Promise.resolve(o.getRun(a.id,l.id)).then(function(t){return null!==t.completed||"cancelling"===t.status?"Run "+l.id+" status: "+t.status+" , completed: "+t.completed:Promise.resolve(o.cancelRun(a.id,l.id))})},function(){throw new Error("\n    Cancel run failed.  \n    Best action is to simply wait for a while for it to timeout \n    The last alternative is to delete the Assistant "+i.name+" and restart your session")})},o=t.assistantApi,i=t.assistant,a=t.thread,l=t.run,u=function(){if(null!=e&&null!=n)return K(function(){return console.log("Cancelling run",e,n),Promise.resolve(o.cancelRun(e,n)).then(function(t){return r=1,t})},function(t){throw n})}();return Promise.resolve(u&&u.then?u.then(s):s(u))}catch(t){return Promise.reject(t)}};export{$ as cancelRun,B as deleteAssistant,I as getLatestMessage,G as getMessages,U as runAssistant,E as setupAssistant,H as uploadFile};
//# sourceMappingURL=index.module.js.map
