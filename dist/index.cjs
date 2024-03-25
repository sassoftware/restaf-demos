var e=require("openai"),t=require("@azure/openai-assistants"),n=require("@sassoftware/restaf"),r=require("@sassoftware/restaflib"),s=require("@sassoftware/restafedit");function o(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var i=/*#__PURE__*/o(e),a=/*#__PURE__*/o(n),l=/*#__PURE__*/o(r),u=/*#__PURE__*/o(s);function c(e){var t=[];return e.map(function(e){var n=e.line.replace(/(\r\n|\n|\r)/gm,"");t.push(0===n.length?"   ":n)}),t}function f(e,t){var n={},r="cas"===t?"caslib":"libref",s=e.split(".");return 2===s.length?(n[r]=s[0],n.name=s[1],n):null}function d(e){if(0===e.length)return"";var t=Object.keys(e[0]).filter(function(e){return!("_rowIndex"===e||"_modified"===e)}).join(",")+"\n",n="";return e.map(function(e){var t,r="",s="";for(var o in e)"_rowIndex"!==o&&"_modified"!==o&&(r=r+s+("."==(t=e[o])||null==t?"":"string"==typeof t?(t=t.replace(/"/g,'""')).trim():t.toString()),s=",");n=n+r+"\n"}),t+n}function h(e,t){try{var n=e()}catch(e){return t(e)}return n&&n.then?n.then(void 0,t):n}var m=function(e,t){try{var n=e.table,r=e.limit,s=e.format,o=e.where,i=e.csv,a=t.source,l=t.sessionID,u=t.restafedit;i=null!=i&&i,console.log(e);var c=f(n,a);return null===c?Promise.resolve("Table must be specified in the form casuser.cars or sashelp.cars"):Promise.resolve(u.setup(t.logonPayload,{source:a,table:c,casServerName:t.casServerName,computeContext:t.computeContext,initialFetch:{qs:{start:0,limit:null==r?2:r,format:null!=s&&s,where:null==o?"":o}}},l)).then(function(e){var t={},n=h(function(){return Promise.resolve(u.scrollTable("first",e)).then(function(){return Promise.resolve(u.getTableSummary(e)).then(function(n){t={table:c,tableSummary:n,columns:e.state.columns,data:!1!==i?e.state.data:d(e.state.data)}})})},function(e){console.log(e),t={error:e}});return n&&n.then?n.then(function(){return t}):t})}catch(e){return Promise.reject(e)}},v=function(e,t){return Promise.resolve(m(e,t)).then(function(e){return JSON.stringify(e,null,4)})},g=function(e){try{var t=e.keywords,n=e.format;switch(console.log("keywords",t,n),n){case"html":var r="<ul>";return t.split(",").forEach(function(e){r+="<li>"+e+"</li>"}),r+="</ul>",Promise.resolve(r);case"array":return Promise.resolve(t.split(","));case"object":var s={};return t.split(",").forEach(function(e,t){s["key"+t]=e}),Promise.resolve(s);default:return Promise.resolve(e)}}catch(e){return Promise.reject(e)}},b=function(e,t,n){try{var r=e.program,s=t.store,o=t.session,i=t.restaflib;return Promise.resolve(h(function(){return"cas"===t.source?Promise.resolve(i.caslRun(s,o,r,{},!0)).then(function(e){return JSON.stringify(e.results,null,4)}):t?Promise.resolve(computeRun(s,o,src)).then(function(e){return Promise.resolve(i.computeResults(s,e,"log")).then(c)}):"Cannot run program without a session"},function(e){return console.log(e),"Error running program "+r}))}catch(e){return Promise.reject(e)}},y=function(e,t){return Promise.resolve(m(e,t)).then(function(e){return JSON.stringify({table:e.table,data:e.data},null,4)})},P=function(e,t){try{return null===f(e.table,t.source)?Promise.resolve("Table must be specified in the form casuser.cars or sashelp.cars"):Promise.resolve(t.restafedit.getTableList(library,t,p)).then(function(e){return JSON.stringify(e,null,4)})}catch(e){return Promise.reject(e)}},S=function(e,t){try{var n=e.limit;return Promise.resolve(t.restafedit.getTableList(e.library,t,{qs:{limit:null==n?10:n,start:0}})).then(function(e){return JSON.stringify(e,null,4)})}catch(e){return Promise.reject(e)}},w=function(e,t){try{var n=e.limit,r=e.start;return Promise.resolve(t.restafedit.getLibraryList(t,{qs:{limit:null==n?10:n,start:null==r?0:r}})).then(function(e){return JSON.stringify(e,null,4)})}catch(e){return Promise.reject(e)}},A=function(e,t){try{var n=e.resource,r=e.limit,s=t.store;return r=null==r?10:r,!1===["files","folders","reports"].includes(n.toLowerCase())?Promise.resolve('{Error: "resource '+n+' is not supported at this time"}'):Promise.resolve(s.addServices(n)).then(function(e){var t={qs:{limit:r,start:0}};return Promise.resolve(s.apiCall(e[n].links(n),t)).then(function(e){var t=e.itemsList();return JSON.stringify(t,null,4)})})}catch(e){return Promise.reject(e)}},T=function(e,t,n){try{var r=e.metadata,s=t.store;console.log("metadata",r);var o=r.replace(/,/g," ");return console.log(r),Promise.resolve(h(function(){return Promise.resolve(s.addServices("catalog")).then(function(e){var t=e.catalog,n={qs:{q:o}};return console.log(n),Promise.resolve(s.apiCall(t.links("search"),n)).then(function(e){return JSON.stringify(e.items(),null,4)})})},function(e){return console.log(JSON.stringify(e)),"Error searching catalog"}))}catch(e){return Promise.reject(e)}},j={name:"_catalogSearch",description:"Search for the specified metadata in SAS Viya.\n      the search is specified as a comma delimited string like libname:casuser,Columns:Make,name:abc\n      Convert string to a query string using these patterns:\n      libname xxx to libname:xxx\n      Column xxx to Column.name:xxx\n      \n      ",parameters:{properties:{metadata:{type:"string",description:"The metadata to return"}},type:"object",required:["metadata"]}},k={name:"_getData",description:"Fetch data from a  table like casuser.cars.\n                To limit the number of rows, specify the limit parameter.\n                If format is true, then the data will be formatted.\n                Use standard where clause to filter the data.\n                To return data in csv format, specify csv = true. Default is false.",parameters:{properties:{table:{type:"string",description:"The table to setup. The form of the table is casuser.cars"},limit:{type:"integer",description:"Fetch only the specified number of rows"},format:{type:"boolean",description:"Format the string - true or false"},where:{type:"string",description:'A where clause like Make eq "Audi"'},csv:{type:"boolean",description:"Return data in csv format - true or false"}},type:"object",required:["table"]}},_={name:"_listSASObjects",description:"list SAS resources like reports, files, folders. Specify the limit parameter to limit the number of items returned",parameters:{properties:{resource:{type:"string",description:"The objecttable to setup. The form of the table is casuser.cars"},limit:{type:"integer",description:"Get this many items"}},type:"object",required:["resource","limit"]}},q={name:"_listSASDataLib",description:"list available SAS libs, calibs, librefs or libraries.\n     This tool is the only one that can answer questions like this.\n\n     A example would be list libs. \n     If limit is not is specified, then the function \n     will return the first 10 libs.\n    ",parameters:{properties:{limit:{type:"integer",description:"Return only this many libs. If not specified, then return 10 libs."},source:{type:"string",description:"The source of the data. cas or compute",enum:["cas","compute"]}},type:"object"}},x={name:"_listSASTables",description:"for a given SAS library, lib, caslibs or libref get the list of available tables.\n    (ex: list tables for Samples)\n    Optionally let user specify the source as cas or compute.",parameters:{properties:{library:{type:"string",description:"A SAS library like casuser, sashelp, samples"},limit:{type:"integer",description:"Return only this many tables. If not specified, then return 10 tables."},source:{type:"string",description:"The source of the data. cas or compute",enum:["cas","compute"]}},type:"object",required:["library"]}},E={name:"_listColumns",description:"Get schema or columns for specified SAS  table. Table is of the form sashelp.cars",parameters:{properties:{table:{type:"string",description:"A table like sashelp.cars"}},type:"object",required:["table"]}},I={name:"_describeTable",description:"Describe the SAS table like sashelp.cars . return information on the table like columns, types, keys. Optionally format the data",parameters:{properties:{table:{type:"string",description:"A table like sashelp.cars"},format:{type:"boolean",description:"If true then format the data"}},type:"object",required:["table"]}},N={name:"_runSAS",description:"run the specified sas program",parameters:{properties:{program:{type:"string",description:"this is the program to run"}},type:"object",required:["program"]}},O={name:"_keywords",description:"format a comma-separated keywords like a,b,c into html, array, object",parameters:{properties:{keywords:{type:"string",description:"A comma-separated list of keywords like a,b,c"},format:{type:"string",enum:["html","array","object"],description:"Format the string"}},type:"object",required:["keywords","format"]}};function C(e,t){var n=e;return"openai"===t&&(n={listAssistants:function(e){return function(){var t=[].slice.call(arguments);return e.beta.assistants.list(t[0])}}(e),createAssistant:function(e){return function(){var t=[].slice.call(arguments);return e.beta.assistants.create(t[0])}}(e),getAssistant:function(e){return function(){var t=[].slice.call(arguments);return e.beta.assistants.retrieve(t[0])}}(e),deleteAssistant:function(e){return function(){var t=[].slice.call(arguments);return e.beta.assistants.del(t[0])}}(e),updateAssistant:function(e){return function(){var t=[].slice.call(arguments),n=t[0],r=t[1];return r.fileIds&&(r.file_ids=r.fileIds,delete r.fileIds),e.beta.assistants.update(n,r)}}(e),createThread:function(e){return function(){var t=[].slice.call(arguments)[0];return null==t&&(t={}),e.beta.threads.create(t)}}(e),getThread:function(e){return function(){var t=[].slice.call(arguments);return e.beta.threads.retrieve(t[0])}}(e),deleteThread:function(e){return function(){var t=[].slice.call(arguments);return e.beta.threads.del(t[0])}}(e),createMessage:function(e){return function(){var t=[].slice.call(arguments),n=t[0],r=t[3],s={role:t[1],content:t[2]};return null!=r&&(s=Object.assign(s,r)),e.beta.threads.messages.create(n,s)}}(e),listMessages:function(e){return function(){var t=[].slice.call(arguments);return e.beta.threads.messages.list(t[0],t[1])}}(e),uploadFile:function(e){return function(){var t=[].slice.call(arguments);return e.files.create({file:t[0],purpose:t[1]})}}(e),createAssistantFile:function(e){return function(){var t=[].slice.call(arguments),n=t[0],r={file_id:t[1]};return console.log(r),console.log(n),e.beta.assistants.files.create(n,r)}}(e),createRun:function(e){return function(){var t=[].slice.call(arguments),n=t[1];return e.beta.threads.runs.create(t[0],{assistant_id:n.assistantId,additional_instructions:n.instructions,tools:null!=n.tools?n.tools:[]})}}(e),getRun:function(e){return function(){var t=[].slice.call(arguments);return e.beta.threads.runs.retrieve(t[0],t[1])}}(e),listRuns:function(e){return function(){var t=[].slice.call(arguments);return e.beta.threads.runs.list(t[0])}}(e),cancelRun:function(e){return function(){var t=[].slice.call(arguments);return e.beta.threads.runs.cancel(t[0],t[1])}}(e),submitToolOutputsToRun:function(e){return function(){var t=[].slice.call(arguments);return e.beta.threads.runs.submitToolOutputs(t[0],t[1],t[2])}}(e)}),n}var R=function(e,t){try{return Promise.resolve(e.assistantApi.listMessages(e.thread.id,{limit:t})).then(function(e){for(var t=[],n=e.data,r=0;r<e.data.length;r++){var s=n[r].content[0];if("assistant"!==n[r].role)break;console.log("annotations",s[s.type].annotations),t.push({id:n[r].id,role:n[r].role,type:s.type,content:s[s.type].value})}return t.length>1&&(t=t.reverse()),t})}catch(e){return Promise.reject(e)}};function D(e,t,n){if(!e.s){if(n instanceof J){if(!n.s)return void(n.o=D.bind(null,e,t));1&t&&(t=n.s),n=n.v}if(n&&n.then)return void n.then(D.bind(null,e,t),D.bind(null,e,2));e.s=t,e.v=n;var r=e.o;r&&r(e)}}var F=function(e,t){try{var n=t.assistantApi,r=t.thread,s=null,o=null,i=function(e,t){var n;do{var r=e();if(r&&r.then){if(!L(r)){n=!0;break}r=r.v}var s=t();if(L(s)&&(s=s.v),!s)return r}while(!s.then);var o=new J,i=D.bind(null,o,2);return(n?r.then(a):s.then(l)).then(void 0,i),o;function a(n){for(r=n;L(s=t())&&(s=s.v),s;){if(s.then)return void s.then(l).then(void 0,i);if((r=e())&&r.then){if(!L(r))return void r.then(a).then(void 0,i);r=r.v}}D(o,1,r)}function l(n){if(n){do{if((r=e())&&r.then){if(!L(r))return void r.then(a).then(void 0,i);r=r.v}if(L(n=t())&&(n=n.v),!n)return void D(o,1,r)}while(!n.then);n.then(l).then(void 0,i)}else D(o,1,r)}}(function(){return Promise.resolve(n.getRun(r.id,e.id)).then(function(e){o=e,console.log("-------------------",o.status);var t=function(){if("queued"===o.status||"in_progress"===o.status||"cancelling"===o.status)return Promise.resolve(new Promise(function(e){return setTimeout(e,500)})).then(function(){console.log("waited 500 ms")});s=o.status}();if(t&&t.then)return t.then(function(){})})},function(){return null===s});return Promise.resolve(i&&i.then?i.then(function(){return o}):o)}catch(e){return Promise.reject(e)}};const J=/*#__PURE__*/function(){function e(){}return e.prototype.then=function(t,n){const r=new e,s=this.s;if(s){const e=1&s?t:n;if(e){try{D(r,1,e(this.v))}catch(e){D(r,2,e)}return r}return this}return this.o=function(e){try{const s=e.v;1&e.s?D(r,1,t?t(s):s):n?D(r,1,n(s)):D(r,2,s)}catch(e){D(r,2,e)}},r},e}();function L(e){return e instanceof J&&1&e.s}const M="undefined"!=typeof Symbol?Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator")):"@@iterator";function U(e,t,n){if(!e.s){if(n instanceof Y){if(!n.s)return void(n.o=U.bind(null,e,t));1&t&&(t=n.s),n=n.v}if(n&&n.then)return void n.then(U.bind(null,e,t),U.bind(null,e,2));e.s=t,e.v=n;var r=e.o;r&&r(e)}}var Y=/*#__PURE__*/function(){function e(){}return e.prototype.then=function(t,n){var r=new e,s=this.s;if(s){var o=1&s?t:n;if(o){try{U(r,1,o(this.v))}catch(e){U(r,2,e)}return r}return this}return this.o=function(e){try{var s=e.v;1&e.s?U(r,1,t?t(s):s):n?U(r,1,n(s)):U(r,2,s)}catch(e){U(r,2,e)}},r},e}();function z(e){return e instanceof Y&&1&e.s}function B(e,t,n){return"openai"===n?{tool_call_id:e,output:JSON.stringify(t)}:{toolCallId:e,output:JSON.stringify(t)}}function G(e){var t="\n Here are some tips for formatting.\n\n  Use either unordered lists, tables or nested tables based.\n  Format the response as a html table if the content of the response is one of the following formats:\n\n  Format as table if the response is one of these forms\n  - a comma-delimited format \n  - An array like this [{a:1,b:2},{a:1,b:3},...]\n\n  The table should have a light blue background for the column headers. \n  Use a border width of 1px and solid style for the table.\n\n  if the response from a tool is of the form  like ['a','b','c', ...] or [1,11,8, ...] use an unordered list\n\n\n if the response from a tool is of the form \n {a: {a1:10, bx:20, c: {cx:3, az: 4}} } then format the message as nested html table. \n\n  ";return null!=e&&(t=e+t),t}function K(e,t){try{var n=e()}catch(e){return t(e)}return n&&n.then?n.then(void 0,t):n}function V(e,t){try{var n=e()}catch(e){return t(e)}return n&&n.then?n.then(void 0,t):n}function W(e,t){try{var n=e()}catch(e){return t(e)}return n&&n.then?n.then(void 0,t):n}exports.cancelRun=function(e,t,n){try{var r,s=function(e){return r?e:null==l||null==a?"No run or thread to cancel":W(function(){return Promise.resolve(o.getRun(a.id,l.id)).then(function(e){return null!==e.completed||"cancelling"===e.status?"Run "+l.id+" status: "+e.status+" , completed: "+e.completed:Promise.resolve(o.cancelRun(a.id,l.id))})},function(){throw new Error("\n    Cancel run failed.  \n    Best action is to simply wait for a while for it to timeout \n    The last alternative is to delete the Assistant "+i.name+" and restart your session")})},o=e.assistantApi,i=e.assistant,a=e.thread,l=e.run,u=function(){if(null!=t&&null!=n)return W(function(){return console.log("Cancelling run",t,n),Promise.resolve(o.cancelRun(t,n)).then(function(e){return r=1,e})},function(e){throw n})}();return Promise.resolve(u&&u.then?u.then(s):s(u))}catch(e){return Promise.reject(e)}},exports.deleteAssistant=function(e,t){try{var n,r=function(t){return n?t:K(function(){if(null!=o.metadata.lastThread)return Promise.resolve(s.deleteThread(o.metadata.lastThread)).then(function(t){return console.log("Thread ${assistant.metadata.lastThread} deleted",t),Promise.resolve(s.deleteAssistant(o.id)).then(function(n){return t=n,console.log("Assistant "+o.name+" deleted",t),e.assistant=null,e.assistantid="0","Assistant "+o.name+" deleted"})})},function(e){throw console.log(e),new Error("Failed to delete session and thread\n    "+e)})},s=e.assistantApi,o=e.assistant;console.log("in closeAssistant");var i=function(){if(null!=t)return K(function(){if(null!=t)return Promise.resolve(s.deleteAssistant(id)).then(function(){return n=1,"Assistant "+t+" deleted."})},function(e){throw console.log(e),new Error("\n        Delete of assistant "+t+" failed")})}();return Promise.resolve(i&&i.then?i.then(r):r(i))}catch(e){return Promise.reject(e)}},exports.getLatestMessage=R,exports.getMessages=function(e,t){try{return Promise.resolve(e.assistantApi.listMessages(e.thread.id,{limit:t})).then(function(e){return e.data.map(function(e){var t=e.content[0];return{id:e.id,role:e.role,type:t.type,content:t[t.type].value}})})}catch(e){return Promise.reject(e)}},exports.runAssistant=function(e,t,n){try{var r=function(t){return Promise.resolve(function(e,t,n){try{var r=e.assistantApi,s=e.assistant,o=e.thread;console.log(n);var i={assistantId:s.id,instructions:G(n),tools:s.tools};return Promise.resolve(r.createRun(o.id,i)).then(function(t){return e.run=t,Promise.resolve(F(t,e)).then(function(t){var n,r=function(){if("completed"===t.status)return Promise.resolve(R(e,5)).then(function(e){n=e});var r=function(){if("requires_action"===t.status)return Promise.resolve(function(e,t){try{var n=function(){return Promise.resolve(r.submitToolOutputsToRun(i.id,a.id,"openai"===o?{tool_outputs:u}:u)).then(function(e){return Promise.resolve(F(e,t))})},r=t.assistantApi,s=t.appEnv,o=t.provider,i=t.thread,a=t.run,l=t.domainTools.functionList,u=[],c=function(e,t,n){if("function"==typeof e[M]){var r,s,o,i=e[M]();if(function e(n){try{for(;!(r=i.next()).done;)if((n=t(r.value))&&n.then){if(!z(n))return void n.then(e,o||(o=U.bind(null,s=new Y,2)));n=n.v}s?U(s,1,n):s=n}catch(e){U(s||(s=new Y),2,e)}}(),i.return){var a=function(e){try{r.done||i.return()}catch(e){}return e};if(s&&s.then)return s.then(a,function(e){throw a(e)});a()}return s}if(!("length"in e))throw new TypeError("Object is not iterable");for(var l=[],u=0;u<e.length;u++)l.push(e[u]);return function(e,t,n){var r,s,o=-1;return function n(i){try{for(;++o<e.length;)if((i=t(o))&&i.then){if(!z(i))return void i.then(n,s||(s=U.bind(null,r=new Y,2)));i=i.v}r?U(r,1,i):r=i}catch(e){U(r||(r=new Y),2,e)}}(),r}(l,function(e){return t(l[e])})}("openai"===o?e.required_action.submit_tool_outputs.tool_calls:e.requiredAction.submitToolOutputs.toolCalls,function(e){var n=e.function.name;console.log("Requested function: ",n);var r=JSON.parse(e.function.arguments),i=l[n],a=function(){if(null==i)u.push(B(e.id,"Function "+n+" not found. \n      Probable causes: \n        Using thread that had outdated tool references.\n        Currrent specs point has mistmatch with function name\n        ",o));else{var a=function(i,a){try{var c=(console.log(">> Calling function: ",n),Promise.resolve(l[n](r,s,t)).then(function(t){console.log(">> Function call completed"),u.push("openai"===o?{tool_call_id:e.id,output:JSON.stringify(t)}:{toolCallId:e.id,output:JSON.stringify(t)})}))}catch(e){return a(e)}return c&&c.then?c.then(void 0,a):c}(0,function(t){u.push(B(e.id,t,o))});if(a&&a.then)return a.then(function(){})}}();if(a&&a.then)return a.then(function(){})});return Promise.resolve(c&&c.then?c.then(n):n())}catch(e){return Promise.reject(e)}}(t,e)).then(function(t){return console.log("getting latest message "),Promise.resolve(R(e,5)).then(function(e){n=e})});n=[{runStatus:t.status}]}();return r&&r.then?r.then(function(){}):void 0}();return r&&r.then?r.then(function(){return n}):n})})}catch(e){return Promise.reject(e)}}(e,0,n))},s=e.thread,o=e.assistantApi,i=function(n,r){try{var i=(a={},"openai"===e.provider?a.file_ids=e.assistant.file_ids:a.fileIds=e.assistant.fileIds,Promise.resolve(o.createMessage(s.id,"user",t,a)).then(function(){}))}catch(e){return r(e)}var a;return i&&i.then?i.then(void 0,r):i}(0,function(e){throw console.log(e.status),console.log(e.error),new Error("\n     Request failed on adding user message to thread.\n     See error below. \n     If thread is active, you can try canceling the run.\n     "+e.status+" "+e.error)});return Promise.resolve(i&&i.then?i.then(r):r())}catch(e){return Promise.reject(e)}},exports.setupAssistant=function(e){try{var n,r=e.credentials,s=r.key,o=r.endPoint;n="openai"===e.provider?new i.default({apiKey:s,dangerouslyAllowBrowser:!0}):new t.AssistantsClient(o,new t.AzureKeyCredential(s,{}));var c,f=function(e,t,n){var r=[_,q,x,E,I,j,k,N,O],s=[];r.forEach(function(e){var t={type:"function",function:Object.assign({},e)};s.push(t)});var o={_getData:y,_listSASObjects:A,_listSASTables:S,_listColumns:P,_listSASDataLib:w,_runSAS:b,_keywords:g,_describeTable:v,_catalogSearch:T},i="undefined"==typeof window?(console.log("instructions for node use "),"\n You are a Assistant designed for SAS users. You can help SAS users with their SAS related questions and provide information\n  on topics like libraries(alias of libs, caslibs and libref), reports  and tables. You can also fetch data from then tables and run SAS programs. You can also help answer questions about the \n  data that has been returned from previous queries. Most times the user will be focused on these areas.\n  Always try the provided tools first to find an answer to your question. If the query is not clear then ask the user for clarification before creating a response.\n  Always report always include annotation when information is found in a file.\n  "):(console.log("instructions for web"),"\n You are a Assistant designed for SAS users. You can help SAS users with their SAS related questions and provide information\n  on topics like libraries(alias of libs, caslibs and libref), reports  and tables. You can also fetch data from then tables and run SAS programs. You can also help answer questions about the \n  data that has been returned from previous queries. Most times the user will be focused on these areas. \n  try the provided tools and files first to find an answer to your question. If the query is not clear then ask the user for clarification before creating a response.\n  Always include annotation when information is found in a file\n\n  \n  ");return{specs:r,tools:s,functionList:o,instructions:i}}(),d=[],h=e.domainTools.tools;d=h.length>0?f.tools.filter(function(e){var t=h.findIndex(function(t,n){return t.function.name===e.function.name});return-1!==t&&console.log("overriding",e.function.name),-1===t}):f.tools,c=!0===e.domainTools.replace?e.domainTools:{tools:d.concat(h),functionList:Object.assign(f.functionList,e.domainTools.functionList),instructions:e.instructions?e.instructions+f.instructions:f.instructions},e.code&&c.tools.push({type:"code_interpreter"}),e.retrieval&&c.tools.push({type:"retrieval"}),console.log(c.instructions);var m={provider:e.provider,model:e.model,domainTools:c,instructions:c.instructions,assistantName:e.assistantName,assistant:null,assistantid:e.assistantid,thread:null,threadid:e.threadid,appEnv:null,client:n,run:null,assistantApi:C(n,e.provider),code:e.code,retrieval:e.retrieval,userData:e.userData,user:e.user};return Promise.resolve(function(e){try{var t={host:null,logonPayload:null,store:null,source:"none",currentSource:"none",session:null,servers:null,serverName:null,casServerName:null,sessionID:null,compute:{},cas:{},restaf:a.default,restaflib:l.default,restafedit:u.default};if(null==e)return Promise.resolve(t);if("none"==e.source)return t.userData=e.userData,t.logonPayload=e.logonPayload,t.currentSource="none",Promise.resolve(t);var n=e.source,r=e.logonPayload,s=n.split(",")[0];t.currentSource=s,t.host=r.host;var o=a.default.initStore({casProxy:!0});return Promise.resolve(o.logon(r)).then(function(){function e(){var e=function(){if(n.indexOf("compute")>=0){t.compute={servers:null};var e=function(e,n){try{var r=Promise.resolve(l.default.computeSetup(o)).then(function(e){return Promise.resolve(o.apiCall(t.session.links("self"))).then(function(n){t.compute.sessionID=n.items("id"),"compute"===s&&(t.source="compute",t.session=e,t.servers=null,t.serverName=null,t.sessionID=t.compute.sessionID)})})}catch(e){return n(e)}return r&&r.then?r.then(void 0,n):r}(0,function(e){console.log(JSON.stringify(e,null,4))});if(e&&e.then)return e.then(function(){})}}();return e&&e.then?e.then(function(){return t}):t}t.host=r.host,t.logonPayload=r,t.store=o;var i=function(){if(n.indexOf("cas")>=0)return Promise.resolve(l.default.casSetup(o,null)).then(function(e){var n=e.session,r=e.servers,i=n.links("execute","link","server");return t.cas={session:n,servers:r,casServerName:i},Promise.resolve(o.apiCall(n.links("self"))).then(function(e){t.cas.sessionID=e.items("id"),"cas"===s&&(t.source="cas",t.session=n,t.servers=r,t.serverName=i,t.casServerName=i,t.sessionID=t.cas.sessionID)})})}();return i&&i.then?i.then(e):e()})}catch(e){return Promise.reject(e)}}(e.viyaConfig)).then(function(t){return m.appEnv=t,m.appEnv.userData=e.userData,m.appEnv.user=e.user,Promise.resolve(function(e){try{var t,n=e.assistantName,r=e.model,s=e.assistantid,o=e.instructions,i=e.domainTools,a=e.assistantApi;return Promise.resolve(function(e,l){try{var u=function(){function e(e){if(t)return e;var l={name:n,instructions:o,model:r,tools:i.tools};console.log("Attempting to find assistant by name ",n);var u=null;return Promise.resolve(a.listAssistants({order:"desc",limit:"100"})).then(function(e){function t(){return console.log("Creating new assistant"),Promise.resolve(a.createAssistant(l)).then(function(e){return u=e})}if(null!=(u=e.data.find(function(e){if(e.name===n)return e}))&&"REUSE"===s)return console.log("Found assistant ",n,u.id),u;var r=function(){if(null!=u)return console.log("Deleting old assistant ",n,u.id),Promise.resolve(a.deleteAssistant(u.id)).then(function(){})}();return r&&r.then?r.then(t):t()})}var l=function(){if("NEW"!==s&&"REUSE"!==s)return console.log("Using assistantid ",s),Promise.resolve(a.getAssistant(s)).then(function(e){return t=1,e})}();return l&&l.then?l.then(e):e(l)}()}catch(e){return l(e)}return u&&u.then?u.then(void 0,l):u}(0,function(e){throw console.log(e),new Error("Error status "+e.status+". Failed to create assistant. See console for details.")}))}catch(e){return Promise.reject(e)}}(m)).then(function(e){return m.assistant=e,Promise.resolve(function(e){try{var t,n=e.assistantApi,r=null,s=e.threadid,o=e.assistant.metadata.lastThread;console.log("loadThread",s,o);var i=function(e,i){try{var a=function(){function e(e){var i;if(t)return e;function a(e){if(i)return e;function t(){return console.log("Creating new thread"),Promise.resolve(n.createThread()).then(function(e){return r=e})}var s=function(){if(null!=o)return console.log("Deleting last thread",o),Promise.resolve(n.deleteThread(o)).then(function(){})}();return s&&s.then?s.then(t):t()}var l=function(){if("REUSE"===s&&null!=o)return console.log("Attempting to use previous ",o),Promise.resolve(n.getThread(o)).then(function(e){return i=1,e})}();return l&&l.then?l.then(a):a(l)}var i=function(){if("REUSE"!==s&&"NEW"!==s)return console.log("Using threadid ",s),Promise.resolve(n.getThread(s)).then(function(e){return t=1,e})}();return i&&i.then?i.then(e):e(i)}()}catch(e){return i(e)}return a&&a.then?a.then(void 0,i):a}(0,function(e){throw console.log(e),new Error("Error status "+e.status+". Failed to create thread. See console for details.")});return Promise.resolve(i&&i.then?i.then(function(){return r}):r)}catch(e){return Promise.reject(e)}}(m)).then(function(e){return m.thread=e,Promise.resolve(m.assistantApi.updateAssistant(m.assistant.id,{metadata:{lastThread:m.thread.id}})).then(function(e){return m.assistant=e,m.threadid=m.thread.id,console.log("--------------------------------------"),console.log("Current session:"),console.log("Provider: ",m.provider),console.log("Model: ",m.model),console.log("Assistant: ",m.assistant.name,"Assistant id",m.assistant.id),console.log("Threadid: ",m.thread.id),console.log("Viya Source:",m.appEnv.source),console.log("--------------------------------------"),m})})})})}catch(e){return Promise.reject(e)}},exports.uploadFile=function(e,t,n,r,s){try{var o=s.assistantApi,i=s.assistant,a=s.provider,l=null;return Promise.resolve(V(function(){return Promise.resolve("openai"===a?o.uploadFile(t,r):o.uploadFile(n,r,{filename:e})).then(function(t){return l=t,console.log("uploaded file:",l.id),Promise.resolve(o.createAssistantFile(i.id,l.id)).then(function(t){return console.log("Assistant File ",t.id),Promise.resolve(function(e,t){try{var n=e.assistantApi,r=e.assistant,s="openai"===e.provider?r.file_ids:r.fileIds;return s.push(t.id),s=s.filter(function(e){return null!=e}),Promise.resolve(V(function(){return Promise.resolve(n.updateAssistant(r.id,{fileIds:s})).then(function(t){e.assistant=t})},function(e){throw console.log(e),new Error("Failed to update assistant with new file "+t.id)}))}catch(e){return Promise.reject(e)}}(s,t)).then(function(){return{fileName:e,fileId:l.id,assistantFileId:t.id}})})})},function(t){throw console.log(t),new Error("Failed to upload file "+e)}))}catch(e){return Promise.reject(e)}};
//# sourceMappingURL=index.cjs.map
