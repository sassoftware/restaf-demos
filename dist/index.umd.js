!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("openai"),require("@azure/openai-assistants"),require("@sassoftware/restafedit"),require("@sassoftware/restaflib"),require("@sassoftware/restaf")):"function"==typeof define&&define.amd?define(["exports","openai","@azure/openai-assistants","@sassoftware/restafedit","@sassoftware/restaflib","@sassoftware/restaf"],t):t((e||self).viyaAssistantjs={},e.openai,e.openaiAssistants,e.restafedit,e.restaflib,e.restaf)}(this,function(e,t,n,r,s,i){function o(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var a=/*#__PURE__*/o(t),u=/*#__PURE__*/o(r),l=/*#__PURE__*/o(s),c=/*#__PURE__*/o(i);function f(e){var t=[];return e.map(function(e){var n=e.line.replace(/(\r\n|\n|\r)/gm,"");t.push(0===n.length?"   ":n)}),t}function h(e,t){var n={},r="cas"===t?"caslib":"libref",s=e.split(".");return 2===s.length?(n[r]=s[0],n.name=s[1],n):null}function d(e){if(0===e.length)return"";var t=Object.keys(e[0]).join(",")+"\n",n="";return e.map(function(e){var t="",r="";Object.values(e).map(function(e){t=t+r+function(e){return"."==e||null==e?"":"string"==typeof e?(e=e.replace(/"/g,'""')).trim():e.toString()}(e),r=","}),n=n+t+"\n"}),t+n}var m=function(e,t){try{var n=e.table,r=e.limit,s=e.format,i=e.where,o=e.csv,a=t.source,l=t.sessionID;o=null!=o&&o,console.log(e);var c=h(n,a);return null===c?Promise.resolve("Table must be specified in the form casuser.cars or sashelp.cars"):Promise.resolve(u.default.setup(t.logonPayload,{source:a,table:c,casServerName:t.casServerName,computeContext:t.computeContext,initialFetch:{qs:{start:0,limit:null==r?2:r,format:null!=s&&s,where:null==i?"":i}}},l)).then(function(e){var t={},n=function(n,r){try{var s=Promise.resolve(u.default.scrollTable("first",e)).then(function(){return Promise.resolve(u.default.getTableSummary(e)).then(function(n){t={table:c,tableSummary:n,columns:e.state.columns,data:!1===o?e.state.data:d(e.state.data)}})})}catch(e){return r(e)}return s&&s.then?s.then(void 0,r):s}(0,function(e){console.log(e),t={error:e}});return n&&n.then?n.then(function(){return t}):t})}catch(e){return Promise.reject(e)}},v=function(e,t){return Promise.resolve(m(e,t)).then(JSON.stringify)},b=function(e){try{var t=e.keywords,n=e.format;switch(console.log("keywords",t,n),n){case"html":var r="<ul>";return t.split(",").forEach(function(e){r+="<li>"+e+"</li>"}),r+="</ul>",Promise.resolve(r);case"array":return Promise.resolve(t.split(","));case"object":var s={};return t.split(",").forEach(function(e,t){s["key"+t]=e}),Promise.resolve(s);default:return Promise.resolve(e)}}catch(e){return Promise.reject(e)}},y=function(e,t){try{var n=e.src,r=t.store,s=t.session;return"cas"===t.source?Promise.resolve(j(r,s,n,{},!0)).then(function(e){return JSON.stringify(e.results)}):Promise.resolve(T(r,s,n)).then(function(e){return Promise.resolve(k(r,e,"log")).then(f)})}catch(e){return Promise.reject(e)}},g=function(e,t){return Promise.resolve(m(e,t)).then(function(e){return JSON.stringify({table:e.table,data:e.data})})},P=function(e,t){try{return null===h(e.table,t.source)?Promise.resolve("Table must be specified in the form casuser.cars or sashelp.cars"):Promise.resolve(O(library,t,p)).then(function(e){return JSON.stringify(e)})}catch(e){return Promise.reject(e)}},S=function(e,t){try{var n=e.limit;return Promise.resolve(O(e.library,t,{qs:{limit:null==n?10:n,start:0}})).then(JSON.stringify)}catch(e){return Promise.reject(e)}},A=function(e,t){try{var n=e.limit,r=e.start,s={qs:{limit:null==n?10:n,start:null==r?0:r}};return console.log("payload",s),Promise.resolve(_(t,s)).then(function(e){return console.log(e),JSON.stringify(e)})}catch(e){return Promise.reject(e)}},w=function(e,t){try{var n=e.resource,r=e.limit,s=t.store;return r=null==r?10:r,!1===["files","folders","reports"].includes(n.toLowerCase())?Promise.resolve('{Error: "resource '+n+' is not supported at this time"}'):Promise.resolve(s.addServices(n)).then(function(e){var t={qs:{limit:r,start:0}};return Promise.resolve(s.apiCall(e[n].links(n),t)).then(function(e){var t=e.itemsList().toJS();return JSON.stringify(t)})})}catch(e){return Promise.reject(e)}},j=l.default.caslRun,T=l.default.computeRun,k=l.default.computeResults,_=u.default.getLibraryList,O=u.default.getTableList,q={name:"_getData",description:"Fetch data from a  table like casuser.cars.\n                To limit the number of rows, specify the limit parameter.\n                If format is true, then the data will be formatted.\n                Use standard where clause to filter the data.\n                To return data in csv format, specify csv = true. Default is false.",parameters:{properties:{table:{type:"string",description:"The table to setup. The form of the table is casuser.cars"},limit:{type:"integer",description:"Fetch only the specified number of rows"},format:{type:"boolean",description:"Format the string - true or false"},where:{type:"string",description:'A where clause like Make eq "Audi"'},csv:{type:"boolean",description:"Return data in csv format - true or false"}},type:"object",required:["table"]}},N={name:"_listSASObjects",description:"list SAS resources like reports, files, folders. Specify the limit parameter to limit the number of items returned",parameters:{properties:{resource:{type:"string",description:"The objecttable to setup. The form of the table is casuser.cars"},limit:{type:"integer",description:"Get this many items"}},type:"object",required:["resource","limit"]}},R={name:"_listSASDataLib",description:"list available SAS libs, calibs, librefs.\n     A example would be list libs. \n     If limit is not is specified, then the function \n     will return the first 10 libs.\n     Optionally allow user to specify the source as cas or compute.",parameters:{properties:{limit:{type:"integer",description:"Return only this many libs. If not specified, then return 10 libs."},source:{type:"string",description:"The source of the data. cas or compute",enum:["cas","compute"]}},type:"object"}},I={name:"_listSASTables",description:"for a given library, lib or caslibs get the list of available tables\n    (ex: list tables for Samples)\n    Optionally let user specify the source as cas or compute.",parameters:{properties:{library:{type:"string",description:"A SAS library like casuser, sashelp, samples"},limit:{type:"integer",description:"Return only this many tables. If not specified, then return 10 tables."},source:{type:"string",description:"The source of the data. cas or compute",enum:["cas","compute"]}},type:"object",required:["library"]}},C={name:"_listColumns",description:"Get schema or columns for specified table. Table is of the form sashelp.cars",parameters:{properties:{table:{type:"string",description:"A table like sashelp.cars"}},type:"object",required:["table"]}},D={name:"_describeTable",description:"Describe the table like sashelp.cars . return information on the table like columns, types, keys. Optionally format the data",parameters:{properties:{table:{type:"string",description:"A table like sashelp.cars"},format:{type:"boolean",description:"If true then format the data"}},type:"object",required:["table"]}},J={name:"_runSAS",description:"run the specified file. The file is a path to the sas program",parameters:{properties:{file:{type:"string",description:"this is the file to run"}},type:"object",required:["file"]}},L={name:"_keywords",description:"format a comma-separated keywords like a,b,c into html, array, object",parameters:{properties:{keywords:{type:"string",description:"A comma-separated list of keywords like a,b,c"},format:{type:"string",enum:["html","array","object"],description:"Format the string"}},type:"object",required:["keywords","format"]}};function x(e,t){var n=function(e){return function(){var t=[].slice.call(arguments);return e.beta.assistants.retrieve(t[0])}},r=e;return"openai"===t&&(r={listAssistants:function(e){return function(){var t=[].slice.call(arguments);return e.beta.assistants.list(t[0])}}(e),createAssistant:function(e){return function(){var t=[].slice.call(arguments);return e.beta.assistants.create(t[0])}}(e),getAssistant:n(e),deleteAssistant:n(e),updateAssistant:function(e){return function(){var t=[].slice.call(arguments);return e.beta.assistants.update(t[0],t[1])}}(e),createThread:function(e){return function(){var t=[].slice.call(arguments)[0];return null==t&&(t={}),e.beta.threads.create(t)}}(e),getThread:function(e){return function(){var t=[].slice.call(arguments);return e.beta.threads.retrieve(t[0])}}(e),deleteThread:function(e){return function(){var t=[].slice.call(arguments);return e.beta.threads.del(t[0])}}(e),createMessage:function(e){return function(){var t=[].slice.call(arguments);return e.beta.threads.messages.create(t[0],{role:t[1],content:t[2]})}}(e),listMessages:function(e){return function(){var t=[].slice.call(arguments),n=t[0],r=t[1];return console.log(n,r),e.beta.threads.messages.list(n,r)}}(e),createRun:function(e){return function(){var t=[].slice.call(arguments),n=t[1];return e.beta.threads.runs.create(t[0],{assistant_id:n.assistantId,instructions:n.instructions})}}(e),getRun:function(e){return function(){var t=[].slice.call(arguments);return e.beta.threads.runs.retrieve(t[0],t[1])}}(e),listRuns:function(e){return function(){var t=[].slice.call(arguments);return e.beta.threads.runs.list(t[0])}}(e),cancelRun:function(e){return function(){var t=[].slice.call(arguments);return e.beta.threads.runs.cancel(t[0],t[1])}}(e),submitToolOutputsToRun:function(e){return function(){var t=[].slice.call(arguments);return e.beta.threads.runs.submitToolOutputs(t[0],t[1],t[2])}}(e)}),r}var E=function(e,t){try{return Promise.resolve(e.assistantApi.listMessages(e.thread.id,{limit:t})).then(function(e){for(var t=[],n=e.data,r=0;r<e.data.length;r++){var s=n[r].content[0];if("assistant"!==n[r].role)break;t.push({id:n[r].id,role:n[r].role,type:s.type,content:s[s.type].value})}return t.length>1&&(t=t.reverse()),t})}catch(e){return Promise.reject(e)}};function F(e,t,n){if(!e.s){if(n instanceof Y){if(!n.s)return void(n.o=F.bind(null,e,t));1&t&&(t=n.s),n=n.v}if(n&&n.then)return void n.then(F.bind(null,e,t),F.bind(null,e,2));e.s=t,e.v=n;var r=e.o;r&&r(e)}}var M=function(e,t){try{var n=t.assistantApi,r=t.thread,s=null,i=null,o=function(e,t){var n;do{var r=e();if(r&&r.then){if(!z(r)){n=!0;break}r=r.v}var s=t();if(z(s)&&(s=s.v),!s)return r}while(!s.then);var i=new Y,o=F.bind(null,i,2);return(n?r.then(a):s.then(u)).then(void 0,o),i;function a(n){for(r=n;z(s=t())&&(s=s.v),s;){if(s.then)return void s.then(u).then(void 0,o);if((r=e())&&r.then){if(!z(r))return void r.then(a).then(void 0,o);r=r.v}}F(i,1,r)}function u(n){if(n){do{if((r=e())&&r.then){if(!z(r))return void r.then(a).then(void 0,o);r=r.v}if(z(n=t())&&(n=n.v),!n)return void F(i,1,r)}while(!n.then);n.then(u).then(void 0,o)}else F(i,1,r)}}(function(){return Promise.resolve(n.getRun(r.id,e.id)).then(function(e){i=e,console.log("-------------------",i.status);var t=function(){if("queued"===i.status||"in_progress"===i.status||"cancelling"===i.status)return Promise.resolve(new Promise(function(e){return setTimeout(e,2e3)})).then(function(){console.log("waited 2000 ms")});s=i.status}();if(t&&t.then)return t.then(function(){})})},function(){return null===s});return Promise.resolve(o&&o.then?o.then(function(){return i}):i)}catch(e){return Promise.reject(e)}};const Y=/*#__PURE__*/function(){function e(){}return e.prototype.then=function(t,n){const r=new e,s=this.s;if(s){const e=1&s?t:n;if(e){try{F(r,1,e(this.v))}catch(e){F(r,2,e)}return r}return this}return this.o=function(e){try{const s=e.v;1&e.s?F(r,1,t?t(s):s):n?F(r,1,n(s)):F(r,2,s)}catch(e){F(r,2,e)}},r},e}();function z(e){return e instanceof Y&&1&e.s}const G="undefined"!=typeof Symbol?Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator")):"@@iterator";function K(e,t,n){if(!e.s){if(n instanceof U){if(!n.s)return void(n.o=K.bind(null,e,t));1&t&&(t=n.s),n=n.v}if(n&&n.then)return void n.then(K.bind(null,e,t),K.bind(null,e,2));e.s=t,e.v=n;var r=e.o;r&&r(e)}}var U=/*#__PURE__*/function(){function e(){}return e.prototype.then=function(t,n){var r=new e,s=this.s;if(s){var i=1&s?t:n;if(i){try{K(r,1,i(this.v))}catch(e){K(r,2,e)}return r}return this}return this.o=function(e){try{var s=e.v;1&e.s?K(r,1,t?t(s):s):n?K(r,1,n(s)):K(r,2,s)}catch(e){K(r,2,e)}},r},e}();function B(e){return e instanceof U&&1&e.s}function H(e,t,n){return"openai"===n?{tool_call_id:e,output:JSON.stringify(t)}:{toolCallId:e,output:JSON.stringify(t)}}function Q(e,t){try{var n=e()}catch(e){return t(e)}return n&&n.then?n.then(void 0,t):n}e.cancelRun=function(e,t,n){try{var r,s=function(e){var t;if(r)return e;if(null===a||null===o)return console.log("No run or thread to cancel"),null;var n=null,s=Q(function(){return Promise.resolve(i.getRun(o.id,a.id)).then(function(e){return console.log(e),null!==e.completed||"cancelling"===e.status?(console.log("Run "+a.id+" status: "+e.status+" , completed: "+e.completed),t=1,null):Promise.resolve(i.cancelRun(o.id,a.id)).then(function(e){n=e})})},function(e){console.log("Error cancelling the run",e)});return s&&s.then?s.then(function(e){return t?e:n}):t?s:n},i=e.assistantApi,o=e.thread,a=e.run,u=function(){if(null!=t||null!=n)return Q(function(){return console.log("Cancelling run",t,n),Promise.resolve(i.cancelRun(t,n)).then(function(e){return r=1,e})},function(e){return console.log("Error cancelling the run ",e,t,n),r=1,null})}();return Promise.resolve(u&&u.then?u.then(s):s(u))}catch(e){return Promise.reject(e)}},e.deleteAssistant=function(e,t){try{console.log("in closeAssistant");var n=e.assistantApi,r=t||e.assistant.id;return Promise.resolve(function(){if(null!=r)return Promise.resolve(n.deleteAssistant(r))}())}catch(e){return Promise.reject(e)}},e.getLatestMessage=E,e.getMessages=function(e,t){try{return Promise.resolve(e.assistantApi.listMessages(e.thread.id,{limit:t})).then(function(e){return e.data.map(function(e){var t=e.content[0];return{id:e.id,role:e.role,type:t.type,content:t[t.type].value}})})}catch(e){return Promise.reject(e)}},e.runAssistant=function(e,t,n){try{var r,s=function(t){return r?t:Promise.resolve(function(e,t,n){try{return Promise.resolve(e.assistantApi.createRun(e.thread.id,{assistantId:e.assistant.id,instructions:null!=n?n:""})).then(function(t){return e.run=t,Promise.resolve(M(t,e)).then(function(t){var n,r=function(){if("completed"===t.status)return Promise.resolve(E(e,5)).then(function(e){n=e});var r=function(){if("requires_action"===t.status)return Promise.resolve(function(e,t){try{var n=function(){return console.log("Adding output to messages"),console.log("toolsOutput",l),console.log(i),console.log(l),Promise.resolve(r.submitToolOutputsToRun(o.id,a.id,"openai"===i?{tool_outputs:l}:l)).then(function(e){return Promise.resolve(M(e,t))})},r=t.assistantApi,s=t.appEnv,i=t.provider,o=t.thread,a=t.run,u=t.domainTools.functionList,l=[],c=function(e,t,n){if("function"==typeof e[G]){var r,s,i,o=e[G]();if(function e(n){try{for(;!(r=o.next()).done;)if((n=t(r.value))&&n.then){if(!B(n))return void n.then(e,i||(i=K.bind(null,s=new U,2)));n=n.v}s?K(s,1,n):s=n}catch(e){K(s||(s=new U),2,e)}}(),o.return){var a=function(e){try{r.done||o.return()}catch(e){}return e};if(s&&s.then)return s.then(a,function(e){throw a(e)});a()}return s}if(!("length"in e))throw new TypeError("Object is not iterable");for(var u=[],l=0;l<e.length;l++)u.push(e[l]);return function(e,t,n){var r,s,i=-1;return function n(o){try{for(;++i<e.length;)if((o=t(i))&&o.then){if(!B(o))return void o.then(n,s||(s=K.bind(null,r=new U,2)));o=o.v}r?K(r,1,o):r=o}catch(e){K(r||(r=new U),2,e)}}(),r}(u,function(e){return t(u[e])})}("openai"===i?e.required_action.submit_tool_outputs.tool_calls:e.requiredAction.submitToolOutputs.toolCalls,function(e){var n=e.function.name;console.log("Requested function: ",n);var r=JSON.parse(e.function.arguments),o=u[n],a=function(){if(null==o)l.push(H(e.id,"Function "+n+" not found. \n      Probable causes: \n        Using thread that had outdated tool references.\n        Currrent specs point has mistmatch with function name\n        ",i));else{var a=function(o,a){try{var c=Promise.resolve(u[n](r,s,t)).then(function(t){console.log("Response from function: ",t),l.push("openai"===i?{tool_call_id:e.id,output:JSON.stringify(t)}:{toolCallId:e.id,output:JSON.stringify(t)})})}catch(e){return a(e)}return c&&c.then?c.then(void 0,a):c}(0,function(t){l.push(H(e.id,t,i))});if(a&&a.then)return a.then(function(){})}}();if(a&&a.then)return a.then(function(){})});return Promise.resolve(c&&c.then?c.then(n):n())}catch(e){return Promise.reject(e)}}(t,e)).then(function(t){return console.log("getting latest message "),Promise.resolve(E(e,5)).then(function(e){n=e})});n=[{runStatus:t.status}]}();return r&&r.then?r.then(function(){}):void 0}();return r&&r.then?r.then(function(){return n}):n})})}catch(e){return Promise.reject(e)}}(e,0,n))},i=e.thread,o=e.assistantApi,a=function(e,n){try{var r=Promise.resolve(o.createMessage(i.id,"user",t)).then(function(){})}catch(e){return n(e)}return r&&r.then?r.then(void 0,n):r}(0,function(e){console.log(e.status),console.log(e.error);var t=JSON.stringify(e.error);return r=1,t});return Promise.resolve(a&&a.then?a.then(s):s(a))}catch(e){return Promise.reject(e)}},e.setupAssistant=function(e){try{var t,r=e.credentials,s=r.key,i=r.endPoint;t="openai"===e.provider?new a.default({apiKey:s,dangerouslyAllowBrowser:!0}):new n.AssistantsClient(i,new n.AzureKeyCredential(s,{}));var o,u=function(e){var t=[N,R,I,C,D,q,J,L],n=[{type:"code_interpreter"}];return"openai"===e&&n.push({type:"retrieval"}),t.forEach(function(e){var t={type:"function",function:Object.assign({},e)};n.push(t)}),{specs:t,tools:n,functionList:{_getData:g,_listSASObjects:w,_listSASTables:S,_listColumns:P,_listSASDataLib:A,_runSAS:y,_keywords:b,_describeTable:v},instructions:"\n You are a Assistant designed for SAS users. You can help SAS users with their SAS related questions and provide information\n  on topics like libraries, reports, tables. You can also fetch data from tables and run SAS programs. You can also help answer questions about the \n  data that has been returned from previous queries.\n\n  If the response from a tool is of the form [{a:1,b:2},{a:1,b:3}] format the table as a html table element like this\n  '<table>\n     <tr>\n       <th>a</th> \n      <th>b</th>\n     </tr>\n    <tr>\n    <td>1</td>\n    <td>2</td>\n    </tr>\n    <tr>\n   <td>2</td>\n   <td>3</td>\n   </tr>\n   </table>' \n  \n  if the response from a tool is of the form [1,2,3] then return the data as a html unodered list to the user.\n  You can also allow users to attach files to the assistant. \n\n  "}}(e.provider);o=!0===e.domainTools.replace?e.domainTools:{tools:e.domainTools.tools.concat(u.tools),functionList:Object.assign(e.domainTools.functionList,u.functionList),instructions:e.instructions?e.instructions+u.instructions:u.instructions};var f={provider:e.provider,model:e.model,domainTools:o,instructions:o.userInstructions,assistantName:e.assistantName,assistant:null,assistantid:e.assistantid,thread:null,threadid:e.threadid,appEnv:null,client:t,run:null,assistantApi:x(t,e.provider)};return Promise.resolve(function(e){try{var t={host:null,logonPayload:null,store:null,source:"none",currentSource:"none",session:null,servers:null,serverName:null,casServerName:null,sessionID:null,compute:{},cas:{},userData:null};if(null==e)return Promise.resolve(t);if("none"==e.source)return t.userData=e.userData,t.logonPayload=e.logonPayload,t.currentSource="none",Promise.resolve(t);var n=e.source,r=e.logonPayload,s=n.split(",")[0];t.currentSource=s,t.host=r.host;var i=c.default.initStore({casProxy:!0});return Promise.resolve(i.logon(r)).then(function(){function e(){function e(){return console.log(t),t}var r=function(){if(n.indexOf("compute")>0)return t.compute={servers:null},Promise.resolve(l.default.computeSetup(i)).then(function(e){return Promise.resolve(i.apiCall(t.session.links("self"))).then(function(n){t.compute.sessionID=n.items("id"),"compute"===s&&(t.source="compute",t.session=e,t.servers=null,t.serverName=null,t.sessionID=t.compute.sessionID)})})}();return r&&r.then?r.then(e):e()}t.host=r.host,t.logonPayload=r,t.store=i;var o=function(){if(n.indexOf("cas")>=0)return Promise.resolve(l.default.casSetup(i,null)).then(function(e){var n=e.session,r=e.servers,o=n.links("execute","link","server");return t.cas={session:n,servers:r,casServerName:o},Promise.resolve(i.apiCall(n.links("self"))).then(function(e){t.cas.sessionID=e.items("id"),"cas"===s&&(t.source="cas",t.session=n,t.servers=r,t.serverName=o,t.casServerName=o,t.sessionID=t.cas.sessionID)})})}();return o&&o.then?o.then(e):e()})}catch(e){return Promise.reject(e)}}(e.viyaConfig)).then(function(e){return f.appEnv=e,Promise.resolve(function(e){try{var t=function(){return e.assistantid=o.id,e.assistant=o,o},n=e.assistantName,r=e.assistantid,s=e.assistantApi,i={name:n,instructions:e.instructions,model:e.model,tools:e.domainTools.tools},o=null,a="0"===r||null==r,u=function(){if(0==a)return Promise.resolve(s.getAssistant(r)).then(function(e){o=e});var e=function(){if(null!=n)return Promise.resolve(s.listAssistants({order:"desc",limit:"100"})).then(function(e){o=e.data.find(function(e){if(e.name===n)return e});var t=function(){if(null==o)return console.log("Creating new assistant"),Promise.resolve(s.createAssistant(i)).then(function(e){o=e})}();if(t&&t.then)return t.then(function(){})})}();return e&&e.then?e.then(function(){}):void 0}();return Promise.resolve(u&&u.then?u.then(t):t())}catch(e){return Promise.reject(e)}}(f)).then(function(e){return f.assistant=e,Promise.resolve(function(e){try{var t=function(e){return s},n=e.assistant,r=e.assistantApi,s=null,i=e.threadid,o=function(t,o){try{var a=function(){"-1"===i&&(i=n.metadata.lastThread);var t="0"===i||null==i?(console.log("Creating new thread"),Promise.resolve(r.createThread()).then(function(t){return s=t,Promise.resolve(r.updateAssistant(n.id,{metadata:{lastThread:s.id}})).then(function(t){e.assistant=t})})):Promise.resolve(r.getThread(i)).then(function(e){s=e});if(t&&t.then)return t.then(function(){})}()}catch(e){return o(e)}return a&&a.then?a.then(void 0,o):a}(0,function(e){throw console.log(e),new Error("Error status "+e.status+". Failed to create thread. See console for details.")});return Promise.resolve(o&&o.then?o.then(t):t())}catch(e){return Promise.reject(e)}}(f)).then(function(e){return f.thread=e,f.threadid=f.thread.id,f})})})}catch(e){return Promise.reject(e)}},e.uploadFile=function(e,t,n){try{var r=n.client,s=n.assistant;return Promise.resolve(r.files.create({file:e,purpose:t})).then(function(e){console.log(".......................",e);var t=[].concat(s.file_ids);t.push(e.id),console.log(t);var i=function(e,i){try{var o=Promise.resolve(r.beta.assistants.update(s.id,{file_ids:t})).then(function(e){n.assistant=e,console.log(".......................",e)})}catch(e){return i(e)}return o&&o.then?o.then(void 0,i):o}(0,function(e){console.log(e)});return i&&i.then?i.then(function(){return t}):t})}catch(e){return Promise.reject(e)}}});
//# sourceMappingURL=index.umd.js.map
