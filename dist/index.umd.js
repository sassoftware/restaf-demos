!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("openai"),require("@azure/openai-assistants"),require("@sassoftware/restaf"),require("@sassoftware/restaflib"),require("@sassoftware/restafedit")):"function"==typeof define&&define.amd?define(["exports","openai","@azure/openai-assistants","@sassoftware/restaf","@sassoftware/restaflib","@sassoftware/restafedit"],t):t((e||self).viyaAssistantjs={},e.openai,e.openaiAssistants,e.restaf,e.restaflib,e.restafedit)}(this,function(e,t,n,r,s,i){function o(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var a=/*#__PURE__*/o(t),u=/*#__PURE__*/o(r),l=/*#__PURE__*/o(s),c=/*#__PURE__*/o(i);function f(e){var t=[];return e.map(function(e){var n=e.line.replace(/(\r\n|\n|\r)/gm,"");t.push(0===n.length?"   ":n)}),t}function d(e,t){var n={},r="cas"===t?"caslib":"libref",s=e.split(".");return 2===s.length?(n[r]=s[0],n.name=s[1],n):null}function h(e){if(0===e.length)return"";var t=Object.keys(e[0]).join(",")+"\n",n="";return e.map(function(e){var t="",r="";Object.values(e).map(function(e){t=t+r+function(e){return"."==e||null==e?"":"string"==typeof e?(e=e.replace(/"/g,'""')).trim():e.toString()}(e),r=","}),n=n+t+"\n"}),t+n}var m=function(e,t){try{var n=e.limit,r=e.format,s=e.where,i=e.csv,o=t.source,a=t.sessionID,u=t.restafedit;i=null!=i&&i;var l=d(e.table,o);return null===l?Promise.resolve("Table must be specified in the form casuser.cars or sashelp.cars"):Promise.resolve(u.setup(t.logonPayload,{source:o,table:l,casServerName:t.casServerName,computeContext:t.computeContext,initialFetch:{qs:{start:0,limit:null==n?2:n,format:null!=r&&r,where:null==s?"":s}}},a)).then(function(e){var t={},n=function(n,r){try{var s=Promise.resolve(u.scrollTable("first",e)).then(function(){return Promise.resolve(u.getTableSummary(e)).then(function(n){t={table:l,tableSummary:n,columns:e.state.columns,data:!1===i?e.state.data:h(e.state.data)}})})}catch(e){return r(e)}return s&&s.then?s.then(void 0,r):s}(0,function(e){console.log(e),t={error:e}});return n&&n.then?n.then(function(){return t}):t})}catch(e){return Promise.reject(e)}},v=function(e,t){return Promise.resolve(m(e,t)).then(JSON.stringify)},y=function(e){try{var t=e.keywords,n=e.format;switch(console.log("keywords",t,n),n){case"html":var r="<ul>";return t.split(",").forEach(function(e){r+="<li>"+e+"</li>"}),r+="</ul>",Promise.resolve(r);case"array":return Promise.resolve(t.split(","));case"object":var s={};return t.split(",").forEach(function(e,t){s["key"+t]=e}),Promise.resolve(s);default:return Promise.resolve(e)}}catch(e){return Promise.reject(e)}},b=function(e,t,n){try{var r=t.store,s=t.session,i=t.restaflib,o=i.computeRun,a=i.computeResults,u=e.program;return"cas"===t.source?Promise.resolve((0,i.caslRun)(r,s,u,{},!0)).then(function(e){return JSON.stringify(e.results)}):Promise.resolve(o(r,s,u)).then(function(e){return Promise.resolve(a(r,e,"log")).then(f)})}catch(e){return Promise.reject(e)}},g=function(e,t){return Promise.resolve(m(e,t)).then(function(e){return JSON.stringify({table:e.table,data:e.data})})},P=function(e,t){try{return null===d(e.table,t.source)?Promise.resolve("Table must be specified in the form casuser.cars or sashelp.cars"):Promise.resolve(t.restafedit.getTableList(library,t,p)).then(JSON.stringify)}catch(e){return Promise.reject(e)}},w=function(e,t){try{var n=e.limit;return Promise.resolve(t.restafedit.getTableList(e.library,t,{qs:{limit:null==n?10:n,start:0}})).then(JSON.stringify)}catch(e){return Promise.reject(e)}},S=function(e,t){try{var n=e.limit,r=e.start;return Promise.resolve(t.restafedit.getLibraryList(t,{qs:{limit:null==n?10:n,start:null==r?0:r}})).then(JSON.stringify)}catch(e){return Promise.reject(e)}},A=function(e,t){try{var n=e.resource,r=e.limit,s=t.store;return r=null==r?10:r,!1===["files","folders","reports"].includes(n.toLowerCase())?Promise.resolve('{Error: "resource '+n+' is not supported at this time"}'):Promise.resolve(s.addServices(n)).then(function(e){var t={qs:{limit:r,start:0}};return Promise.resolve(s.apiCall(e[n].links(n),t)).then(function(e){var t=e.itemsList().toJS();return JSON.stringify(t)})})}catch(e){return Promise.reject(e)}},T={name:"_getData",description:"Fetch data from a  table like casuser.cars.\n                To limit the number of rows, specify the limit parameter.\n                If format is true, then the data will be formatted.\n                Use standard where clause to filter the data.\n                To return data in csv format, specify csv = true. Default is false.",parameters:{properties:{table:{type:"string",description:"The table to setup. The form of the table is casuser.cars"},limit:{type:"integer",description:"Fetch only the specified number of rows"},format:{type:"boolean",description:"Format the string - true or false"},where:{type:"string",description:'A where clause like Make eq "Audi"'},csv:{type:"boolean",description:"Return data in csv format - true or false"}},type:"object",required:["table"]}},j={name:"_listSASObjects",description:"list SAS resources like reports, files, folders. Specify the limit parameter to limit the number of items returned",parameters:{properties:{resource:{type:"string",description:"The objecttable to setup. The form of the table is casuser.cars"},limit:{type:"integer",description:"Get this many items"}},type:"object",required:["resource","limit"]}},k={name:"_listSASDataLib",description:"list available SAS libs, calibs, librefs.\n     A example would be list libs. \n     If limit is not is specified, then the function \n     will return the first 10 libs.\n     Optionally allow user to specify the source as cas or compute.",parameters:{properties:{limit:{type:"integer",description:"Return only this many libs. If not specified, then return 10 libs."},source:{type:"string",description:"The source of the data. cas or compute",enum:["cas","compute"]}},type:"object"}},_={name:"_listSASTables",description:"for a given library, lib or caslibs get the list of available tables\n    (ex: list tables for Samples)\n    Optionally let user specify the source as cas or compute.",parameters:{properties:{library:{type:"string",description:"A SAS library like casuser, sashelp, samples"},limit:{type:"integer",description:"Return only this many tables. If not specified, then return 10 tables."},source:{type:"string",description:"The source of the data. cas or compute",enum:["cas","compute"]}},type:"object",required:["library"]}},O={name:"_listColumns",description:"Get schema or columns for specified table. Table is of the form sashelp.cars",parameters:{properties:{table:{type:"string",description:"A table like sashelp.cars"}},type:"object",required:["table"]}},q={name:"_describeTable",description:"Describe the table like sashelp.cars . return information on the table like columns, types, keys. Optionally format the data",parameters:{properties:{table:{type:"string",description:"A table like sashelp.cars"},format:{type:"boolean",description:"If true then format the data"}},type:"object",required:["table"]}},N={name:"_keywords",description:"format a comma-separated keywords like a,b,c into html, array, object",parameters:{properties:{keywords:{type:"string",description:"A comma-separated list of keywords like a,b,c"},format:{type:"string",enum:["html","array","object"],description:"Format the string"}},type:"object",required:["keywords","format"]}};function I(e,t){var n=e;return"openai"===t&&(n={listAssistants:function(e){return function(){var t=[].slice.call(arguments);return e.beta.assistants.list(t[0])}}(e),createAssistant:function(e){return function(){var t=[].slice.call(arguments);return e.beta.assistants.create(t[0])}}(e),getAssistant:function(e){return function(){var t=[].slice.call(arguments);return e.beta.assistants.retrieve(t[0])}}(e),deleteAssistant:function(e){return function(){var t=[].slice.call(arguments);return e.beta.assistants.del(t[0])}}(e),updateAssistant:function(e){return function(){var t=[].slice.call(arguments),n=t[0],r=t[1];return r.fileIds&&(r.file_ids=r.fileIds,delete r.fileIds),e.beta.assistants.update(n,r)}}(e),createThread:function(e){return function(){var t=[].slice.call(arguments)[0];return null==t&&(t={}),e.beta.threads.create(t)}}(e),getThread:function(e){return function(){var t=[].slice.call(arguments);return e.beta.threads.retrieve(t[0])}}(e),deleteThread:function(e){return function(){var t=[].slice.call(arguments);return e.beta.threads.del(t[0])}}(e),createMessage:function(e){return function(){var t=[].slice.call(arguments);return e.beta.threads.messages.create(t[0],{role:t[1],content:t[2]})}}(e),listMessages:function(e){return function(){var t=[].slice.call(arguments);return e.beta.threads.messages.list(t[0],t[1])}}(e),uploadFile:function(e){return function(){var t=[].slice.call(arguments);return e.files.create({file:t[0],purpose:t[1]})}}(e),createRun:function(e){return function(){var t=[].slice.call(arguments),n=t[1];return e.beta.threads.runs.create(t[0],{assistant_id:n.assistantId,additional_instructions:n.instructions})}}(e),getRun:function(e){return function(){var t=[].slice.call(arguments);return e.beta.threads.runs.retrieve(t[0],t[1])}}(e),listRuns:function(e){return function(){var t=[].slice.call(arguments);return e.beta.threads.runs.list(t[0])}}(e),cancelRun:function(e){return function(){var t=[].slice.call(arguments);return e.beta.threads.runs.cancel(t[0],t[1])}}(e),submitToolOutputsToRun:function(e){return function(){var t=[].slice.call(arguments);return e.beta.threads.runs.submitToolOutputs(t[0],t[1],t[2])}}(e)}),n}var D=function(e,t){try{return Promise.resolve(e.assistantApi.listMessages(e.thread.id,{limit:t})).then(function(e){for(var t=[],n=e.data,r=0;r<e.data.length;r++){var s=n[r].content[0];if("assistant"!==n[r].role)break;t.push({id:n[r].id,role:n[r].role,type:s.type,content:s[s.type].value})}return t.length>1&&(t=t.reverse()),t})}catch(e){return Promise.reject(e)}};function R(e,t,n){if(!e.s){if(n instanceof E){if(!n.s)return void(n.o=R.bind(null,e,t));1&t&&(t=n.s),n=n.v}if(n&&n.then)return void n.then(R.bind(null,e,t),R.bind(null,e,2));e.s=t,e.v=n;var r=e.o;r&&r(e)}}var C=function(e,t){try{var n=t.assistantApi,r=t.thread,s=null,i=null,o=function(e,t){var n;do{var r=e();if(r&&r.then){if(!F(r)){n=!0;break}r=r.v}var s=t();if(F(s)&&(s=s.v),!s)return r}while(!s.then);var i=new E,o=R.bind(null,i,2);return(n?r.then(a):s.then(u)).then(void 0,o),i;function a(n){for(r=n;F(s=t())&&(s=s.v),s;){if(s.then)return void s.then(u).then(void 0,o);if((r=e())&&r.then){if(!F(r))return void r.then(a).then(void 0,o);r=r.v}}R(i,1,r)}function u(n){if(n){do{if((r=e())&&r.then){if(!F(r))return void r.then(a).then(void 0,o);r=r.v}if(F(n=t())&&(n=n.v),!n)return void R(i,1,r)}while(!n.then);n.then(u).then(void 0,o)}else R(i,1,r)}}(function(){return Promise.resolve(n.getRun(r.id,e.id)).then(function(e){i=e,console.log("-------------------",i.status);var t=function(){if("queued"===i.status||"in_progress"===i.status||"cancelling"===i.status)return Promise.resolve(new Promise(function(e){return setTimeout(e,2e3)})).then(function(){console.log("waited 2000 ms")});s=i.status}();if(t&&t.then)return t.then(function(){})})},function(){return null===s});return Promise.resolve(o&&o.then?o.then(function(){return i}):i)}catch(e){return Promise.reject(e)}};const E=/*#__PURE__*/function(){function e(){}return e.prototype.then=function(t,n){const r=new e,s=this.s;if(s){const e=1&s?t:n;if(e){try{R(r,1,e(this.v))}catch(e){R(r,2,e)}return r}return this}return this.o=function(e){try{const s=e.v;1&e.s?R(r,1,t?t(s):s):n?R(r,1,n(s)):R(r,2,s)}catch(e){R(r,2,e)}},r},e}();function F(e){return e instanceof E&&1&e.s}const J="undefined"!=typeof Symbol?Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator")):"@@iterator";function L(e,t,n){if(!e.s){if(n instanceof x){if(!n.s)return void(n.o=L.bind(null,e,t));1&t&&(t=n.s),n=n.v}if(n&&n.then)return void n.then(L.bind(null,e,t),L.bind(null,e,2));e.s=t,e.v=n;var r=e.o;r&&r(e)}}var x=/*#__PURE__*/function(){function e(){}return e.prototype.then=function(t,n){var r=new e,s=this.s;if(s){var i=1&s?t:n;if(i){try{L(r,1,i(this.v))}catch(e){L(r,2,e)}return r}return this}return this.o=function(e){try{var s=e.v;1&e.s?L(r,1,t?t(s):s):n?L(r,1,n(s)):L(r,2,s)}catch(e){L(r,2,e)}},r},e}();function M(e){return e instanceof x&&1&e.s}function Y(e,t,n){return"openai"===n?{tool_call_id:e,output:JSON.stringify(t)}:{toolCallId:e,output:JSON.stringify(t)}}function U(e,t){try{var n=e()}catch(e){return t(e)}return n&&n.then?n.then(void 0,t):n}function z(e,t){try{var n=e()}catch(e){return t(e)}return n&&n.then?n.then(void 0,t):n}e.cancelRun=function(e,t,n){try{var r,s=function(e){return r?e:null==u||null==a?"No run or thread to cancel":z(function(){return Promise.resolve(i.getRun(a.id,u.id)).then(function(e){return null!==e.completed||"cancelling"===e.status?"Run "+u.id+" status: "+e.status+" , completed: "+e.completed:Promise.resolve(i.cancelRun(a.id,u.id))})},function(){throw new Error("\n    Cancel run failed.  \n    Best action is to simply wait for a while for it to timeout \n    The last alternative is to delete the Assistant "+o.name+" and restart your session")})},i=e.assistantApi,o=e.assistant,a=e.thread,u=e.run,l=function(){if(null!=t&&null!=n)return z(function(){return console.log("Cancelling run",t,n),Promise.resolve(i.cancelRun(t,n)).then(function(e){return r=1,e})},function(e){throw n})}();return Promise.resolve(l&&l.then?l.then(s):s(l))}catch(e){return Promise.reject(e)}},e.deleteAssistant=function(e,t){try{var n,r=function(e){return n?e:U(function(){if(null!=i.metadata.lastThread)return Promise.resolve(s.deleteThread(i.metadata.lastThread)).then(function(e){return console.log("Thread ${assistant.metadata.lastThread} deleted",e),Promise.resolve(s.deleteAssistant(i.id)).then(function(t){return e=t,console.log("Assistant "+i.name+" deleted",e),"Assistant "+i.name+" deleted"})})},function(e){throw console.log(e),new Error("Failed to delete session and thread\n    "+e)})},s=e.assistantApi,i=e.assistant;console.log("in closeAssistant");var o=function(){if(null!=t)return U(function(){if(null!=t)return Promise.resolve(s.deleteAssistant(id)).then(function(){return n=1,"Assistant "+t+" deleted."})},function(e){throw console.log(e),new Error("\n        Delete of assistant "+t+" failed")})}();return Promise.resolve(o&&o.then?o.then(r):r(o))}catch(e){return Promise.reject(e)}},e.getLatestMessage=D,e.getMessages=function(e,t){try{return Promise.resolve(e.assistantApi.listMessages(e.thread.id,{limit:t})).then(function(e){return e.data.map(function(e){var t=e.content[0];return{id:e.id,role:e.role,type:t.type,content:t[t.type].value}})})}catch(e){return Promise.reject(e)}},e.runAssistant=function(e,t,n){try{var r=function(t){return Promise.resolve(function(e,t,n){try{return Promise.resolve(e.assistantApi.createRun(e.thread.id,{assistantId:e.assistant.id,instructions:null!=n?n:null})).then(function(t){return e.run=t,Promise.resolve(C(t,e)).then(function(t){var n,r=function(){if("completed"===t.status)return Promise.resolve(D(e,5)).then(function(e){n=e});var r=function(){if("requires_action"===t.status)return Promise.resolve(function(e,t){try{var n=function(){return Promise.resolve(r.submitToolOutputsToRun(o.id,a.id,"openai"===i?{tool_outputs:l}:l)).then(function(e){return Promise.resolve(C(e,t))})},r=t.assistantApi,s=t.appEnv,i=t.provider,o=t.thread,a=t.run,u=t.domainTools.functionList,l=[],c=function(e,t,n){if("function"==typeof e[J]){var r,s,i,o=e[J]();if(function e(n){try{for(;!(r=o.next()).done;)if((n=t(r.value))&&n.then){if(!M(n))return void n.then(e,i||(i=L.bind(null,s=new x,2)));n=n.v}s?L(s,1,n):s=n}catch(e){L(s||(s=new x),2,e)}}(),o.return){var a=function(e){try{r.done||o.return()}catch(e){}return e};if(s&&s.then)return s.then(a,function(e){throw a(e)});a()}return s}if(!("length"in e))throw new TypeError("Object is not iterable");for(var u=[],l=0;l<e.length;l++)u.push(e[l]);return function(e,t,n){var r,s,i=-1;return function n(o){try{for(;++i<e.length;)if((o=t(i))&&o.then){if(!M(o))return void o.then(n,s||(s=L.bind(null,r=new x,2)));o=o.v}r?L(r,1,o):r=o}catch(e){L(r||(r=new x),2,e)}}(),r}(u,function(e){return t(u[e])})}("openai"===i?e.required_action.submit_tool_outputs.tool_calls:e.requiredAction.submitToolOutputs.toolCalls,function(e){var n=e.function.name;console.log("Requested function: ",n);var r=JSON.parse(e.function.arguments),o=u[n],a=function(){if(null==o)l.push(Y(e.id,"Function "+n+" not found. \n      Probable causes: \n        Using thread that had outdated tool references.\n        Currrent specs point has mistmatch with function name\n        ",i));else{var a=function(o,a){try{var c=Promise.resolve(u[n](r,s,t)).then(function(t){l.push("openai"===i?{tool_call_id:e.id,output:JSON.stringify(t)}:{toolCallId:e.id,output:JSON.stringify(t)})})}catch(e){return a(e)}return c&&c.then?c.then(void 0,a):c}(0,function(t){l.push(Y(e.id,t,i))});if(a&&a.then)return a.then(function(){})}}();if(a&&a.then)return a.then(function(){})});return Promise.resolve(c&&c.then?c.then(n):n())}catch(e){return Promise.reject(e)}}(t,e)).then(function(t){return console.log("getting latest message "),Promise.resolve(D(e,5)).then(function(e){n=e})});n=[{runStatus:t.status}]}();return r&&r.then?r.then(function(){}):void 0}();return r&&r.then?r.then(function(){return n}):n})})}catch(e){return Promise.reject(e)}}(e,0,n))},s=e.thread,i=e.assistantApi,o=function(e,n){try{var r=Promise.resolve(i.createMessage(s.id,"user",t)).then(function(){})}catch(e){return n(e)}return r&&r.then?r.then(void 0,n):r}(0,function(e){throw console.log(e.status),console.log(e.error),new Error("\n     Request failed on adding user message to thread.\n     See error below. \n     If thread is active, you can try canceling the run.\n     "+e.status+" "+e.error)});return Promise.resolve(o&&o.then?o.then(r):r())}catch(e){return Promise.reject(e)}},e.setupAssistant=function(e){try{var t,r=e.credentials,s=r.key,i=r.endPoint;t="openai"===e.provider?new a.default({apiKey:s,dangerouslyAllowBrowser:!0}):new n.AssistantsClient(i,new n.AzureKeyCredential(s,{}));var o=function(e,t,n){var r=[j,k,_,O,q,T,N],s=[];return r.forEach(function(e){var t={type:"function",function:Object.assign({},e)};s.push(t)}),{specs:r,tools:s,functionList:{_getData:g,_listSASObjects:A,_listSASTables:w,_listColumns:P,_listSASDataLib:S,_runSAS:b,_keywords:y,_describeTable:v},instructions:"\n You are a Assistant designed for SAS users. You can help SAS users with their SAS related questions and provide information\n  on topics like libraries, reports, tables. You can also fetch data from tables and run SAS programs. You can also help answer questions about the \n  data that has been returned from previous queries.\n  Always try to format the response in a way that is easy for the user to understand in the current environment. \n  For example,\n  If the response from a tool is of the form [{a:1,b:2},{a:1,b:3},...] format the table as a html table element like this\n  '<table>\n     <tr>\n       <th>a</th> \n      <th>b</th>\n     </tr>\n    <tr>\n    <td>1</td>\n    <td>2</td>\n    </tr>\n    <tr>\n   <td>2</td>\n   <td>3</td>\n   </tr>\n   </table>' \n  \n  if the response from a tool is of the form [1,2,3] then return the data as a html unodered list to the user.\n  You can also allow users to attach files to the assistant. \n\n  "}}(),f={};f=!0===e.domainTools.replace?e.domainTools:{tools:e.domainTools.tools.concat(o.tools),functionList:Object.assign(e.domainTools.functionList,o.functionList),instructions:e.instructions?e.instructions+o.instructions:o.instructions},e.code&&f.tools.push({type:"code_interpreter"}),e.retrieval&&f.tools.push({type:"retrieval"});var d={provider:e.provider,model:e.model,domainTools:f,instructions:f.userInstructions,assistantName:e.assistantName,assistant:null,assistantid:e.assistantid,thread:null,threadid:e.threadid,appEnv:null,client:t,run:null,assistantApi:I(t,e.provider),code:e.code,retrieval:e.retrieval,userData:e.userData,user:e.user};return Promise.resolve(function(e){try{var t={host:null,logonPayload:null,store:null,source:"none",currentSource:"none",session:null,servers:null,serverName:null,casServerName:null,sessionID:null,compute:{},cas:{},restaf:u.default,restaflib:l.default,restafedit:c.default};if(null==e)return Promise.resolve(t);if("none"==e.source)return t.userData=e.userData,t.logonPayload=e.logonPayload,t.currentSource="none",Promise.resolve(t);var n=e.source,r=e.logonPayload,s=n.split(",")[0];t.currentSource=s,t.host=r.host;var i=u.default.initStore({casProxy:!0});return Promise.resolve(i.logon(r)).then(function(){function e(){var e=function(){if(n.indexOf("compute")>=0){t.compute={servers:null};var e=function(e,n){try{var r=Promise.resolve(l.default.computeSetup(i)).then(function(e){return Promise.resolve(i.apiCall(t.session.links("self"))).then(function(n){t.compute.sessionID=n.items("id"),"compute"===s&&(t.source="compute",t.session=e,t.servers=null,t.serverName=null,t.sessionID=t.compute.sessionID)})})}catch(e){return n(e)}return r&&r.then?r.then(void 0,n):r}(0,function(e){console.log(JSON.stringify(e,null,4))});if(e&&e.then)return e.then(function(){})}}();return e&&e.then?e.then(function(){return t}):t}t.host=r.host,t.logonPayload=r,t.store=i;var o=function(){if(n.indexOf("cas")>=0)return Promise.resolve(l.default.casSetup(i,null)).then(function(e){var n=e.session,r=e.servers,o=n.links("execute","link","server");return t.cas={session:n,servers:r,casServerName:o},Promise.resolve(i.apiCall(n.links("self"))).then(function(e){t.cas.sessionID=e.items("id"),"cas"===s&&(t.source="cas",t.session=n,t.servers=r,t.serverName=o,t.casServerName=o,t.sessionID=t.cas.sessionID)})})}();return o&&o.then?o.then(e):e()})}catch(e){return Promise.reject(e)}}(e.viyaConfig)).then(function(t){return d.appEnv=t,d.appEnv.userData=e.userData,d.appEnv.user=e.user,Promise.resolve(function(e){try{var t,n=e.assistantName,r=e.model,s=e.assistantid,i=e.instructions,o=e.domainTools,a=e.assistantApi;return Promise.resolve(function(u,l){try{var c=function(){function u(u){var l;if(t)return u;function c(t){return l?t:(console.log("Creating new assistant"),Promise.resolve(a.createAssistant(f)).then(function(t){return e.assistantid=t.id,e.assistant=t,t}))}var f={name:n,instructions:i,model:r,tools:o.tools},d=function(){if("-1"===s)return console.log("Attempting to find assistant by name ",n),Promise.resolve(a.listAssistants({order:"desc",limit:"100"})).then(function(e){var t=e.data.find(function(e){if(e.name===n)return e});if(null!=t)return console.log("Found assistant ",n,t.id),l=1,t})}();return d&&d.then?d.then(c):c(d)}var l=function(){if("0"!==s&&"-1"!==s)return console.log("Using assistantid ",s),Promise.resolve(a.getAssistant(s)).then(function(n){return e.assistant=n,e.assistantid=n.id,t=1,n})}();return l&&l.then?l.then(u):u(l)}()}catch(e){return l(e)}return c&&c.then?c.then(void 0,l):c}(0,function(e){throw console.log(e),new Error("Error status "+e.status+". Failed to create assistant. See console for details.")}))}catch(e){return Promise.reject(e)}}(d)).then(function(e){return d.assistant=e,Promise.resolve(function(e){try{var t,n=e.assistant,r=e.assistantApi,s=null,i=e.threadid,o=function(o,a){try{var u=function(){function o(o){if(t)return o;function a(t){return console.log("Creating new thread"),Promise.resolve(r.createThread()).then(function(t){return s=t,Promise.resolve(r.updateAssistant(n.id,{metadata:{lastThread:s.id}})).then(function(t){e.assistant=t})})}var u=function(){if("-1"===i)return i=n.metadata.lastThread,function(){if(null!=i)return console.log("Attempting to use previous ",i),Promise.resolve(r.getThread(i)).then(function(e){return t=1,e})}()}();return u&&u.then?u.then(a):a()}var a=function(){if("0"!==i&&"-1"!==i)return console.log("Using threadid ",i),Promise.resolve(r.getThread(i)).then(function(e){return t=1,s=e})}();return a&&a.then?a.then(o):o(a)}()}catch(e){return a(e)}return u&&u.then?u.then(void 0,a):u}(0,function(e){throw console.log(e),new Error("Error status "+e.status+". Failed to create thread. See console for details.")});return Promise.resolve(o&&o.then?o.then(function(e){return t?e:s}):t?o:s)}catch(e){return Promise.reject(e)}}(d)).then(function(e){return d.thread=e,d.threadid=d.thread.id,console.log("--------------------------------------"),console.log("Current session:"),console.log("Provider: ",d.provider),console.log("Model: ",d.model),console.log("Assistant: ",d.assistant.name,"Assistant id",d.assistant.id),console.log("Threadid: ",d.thread.id),console.log("Viya Source:",d.appEnv.source),console.log("--------------------------------------"),d})})})}catch(e){return Promise.reject(e)}},e.uploadFile=function(e,t,n,r,s){try{var i=s.assistantApi,o=s.assistant;return Promise.resolve("openai"===s.provider?i.uploadFile(t,r):i.uploadFile(n,r,{filename:e})).then(function(t){function n(e){return r}var r=[].concat(o.file_ids);r.push(t.id),console.log("currentFiles ",r),r=r.filter(function(e){return null!=e});var a=function(e,t){try{var n=Promise.resolve(i.updateAssistant(o.id,{fileIds:r})).then(function(e){s.assistant=e})}catch(e){return t(e)}return n&&n.then?n.then(void 0,t):n}(0,function(t){throw console.log(t),new Error("Failed to update assistant with new file "+e)});return a&&a.then?a.then(n):n()})}catch(e){return Promise.reject(e)}}});
//# sourceMappingURL=index.umd.js.map
