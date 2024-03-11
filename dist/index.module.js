import e from"openai";import{AssistantsClient as t,AzureKeyCredential as n}from"@azure/openai-assistants";import r from"@sassoftware/restafedit";import s from"@sassoftware/restaflib";import o from"@sassoftware/restaf";function i(e){var t=[];return e.map(function(e){var n=e.line.replace(/(\r\n|\n|\r)/gm,"");t.push(0===n.length?"   ":n)}),t}function a(e,t){var n={},r="cas"===t?"caslib":"libref",s=e.split(".");return 2===s.length?(n[r]=s[0],n.name=s[1],n):null}function u(e){if(0===e.length)return"";var t=Object.keys(e[0]).join(",")+"\n",n="";return e.map(function(e){var t="",r="";Object.values(e).map(function(e){t=t+r+function(e){return"."==e||null==e?"":"string"==typeof e?(e=e.replace(/"/g,'""')).trim():e.toString()}(e),r=","}),n=n+t+"\n"}),t+n}var l=function(e,t){try{var n=e.table,s=e.limit,o=e.format,i=e.where,l=e.csv,c=t.source,f=t.sessionID;l=null!=l&&l,console.log(e);var h=a(n,c);return null===h?Promise.resolve("Table must be specified in the form casuser.cars or sashelp.cars"):Promise.resolve(r.setup(t.logonPayload,{source:c,table:h,casServerName:t.casServerName,computeContext:t.computeContext,initialFetch:{qs:{start:0,limit:null==s?2:s,format:null!=o&&o,where:null==i?"":i}}},f)).then(function(e){var t={},n=function(n,s){try{var o=Promise.resolve(r.scrollTable("first",e)).then(function(){return Promise.resolve(r.getTableSummary(e)).then(function(n){t={table:h,tableSummary:n,columns:e.state.columns,data:!1===l?e.state.data:u(e.state.data)}})})}catch(e){return s(e)}return o&&o.then?o.then(void 0,s):o}(0,function(e){console.log(e),t={error:e}});return n&&n.then?n.then(function(){return t}):t})}catch(e){return Promise.reject(e)}},c=function(e,t){return Promise.resolve(l(e,t)).then(JSON.stringify)},f=function(e){try{var t=e.keywords,n=e.format;switch(console.log("keywords",t,n),n){case"html":var r="<ul>";return t.split(",").forEach(function(e){r+="<li>"+e+"</li>"}),r+="</ul>",Promise.resolve(r);case"array":return Promise.resolve(t.split(","));case"object":var s={};return t.split(",").forEach(function(e,t){s["key"+t]=e}),Promise.resolve(s);default:return Promise.resolve(e)}}catch(e){return Promise.reject(e)}},h=function(e,t){try{var n=e.src,r=t.store,s=t.session;return"cas"===t.source?Promise.resolve(g(r,s,n,{},!0)).then(function(e){return JSON.stringify(e.results)}):Promise.resolve(P(r,s,n)).then(function(e){return Promise.resolve(S(r,e,"log")).then(i)})}catch(e){return Promise.reject(e)}},d=function(e,t){return Promise.resolve(l(e,t)).then(function(e){return JSON.stringify({table:e.table,data:e.data})})},m=function(e,t){try{return null===a(e.table,t.source)?Promise.resolve("Table must be specified in the form casuser.cars or sashelp.cars"):Promise.resolve(A(library,t,p)).then(function(e){return JSON.stringify(e)})}catch(e){return Promise.reject(e)}},v=function(e,t){try{var n=e.limit;return Promise.resolve(A(e.library,t,{qs:{limit:null==n?10:n,start:0}})).then(JSON.stringify)}catch(e){return Promise.reject(e)}},b=function(e,t){try{var n=e.limit,r=e.start,s={qs:{limit:null==n?10:n,start:null==r?0:r}};return console.log("payload",s),Promise.resolve(w(t,s)).then(function(e){return console.log(e),JSON.stringify(e)})}catch(e){return Promise.reject(e)}},y=function(e,t){try{var n=e.resource,r=e.limit,s=t.store;return r=null==r?10:r,!1===["files","folders","reports"].includes(n.toLowerCase())?Promise.resolve('{Error: "resource '+n+' is not supported at this time"}'):Promise.resolve(s.addServices(n)).then(function(e){var t={qs:{limit:r,start:0}};return Promise.resolve(s.apiCall(e[n].links(n),t)).then(function(e){var t=e.itemsList().toJS();return JSON.stringify(t)})})}catch(e){return Promise.reject(e)}},g=s.caslRun,P=s.computeRun,S=s.computeResults,w=r.getLibraryList,A=r.getTableList,T={name:"_getData",description:"Fetch data from a  table like casuser.cars.\n                To limit the number of rows, specify the limit parameter.\n                If format is true, then the data will be formatted.\n                Use standard where clause to filter the data.\n                To return data in csv format, specify csv = true. Default is false.",parameters:{properties:{table:{type:"string",description:"The table to setup. The form of the table is casuser.cars"},limit:{type:"integer",description:"Fetch only the specified number of rows"},format:{type:"boolean",description:"Format the string - true or false"},where:{type:"string",description:'A where clause like Make eq "Audi"'},csv:{type:"boolean",description:"Return data in csv format - true or false"}},type:"object",required:["table"]}},j={name:"_listSASObjects",description:"list SAS resources like reports, files, folders. Specify the limit parameter to limit the number of items returned",parameters:{properties:{resource:{type:"string",description:"The objecttable to setup. The form of the table is casuser.cars"},limit:{type:"integer",description:"Get this many items"}},type:"object",required:["resource","limit"]}},k={name:"_listSASDataLib",description:"list available SAS libs, calibs, librefs.\n     A example would be list libs. \n     If limit is not is specified, then the function \n     will return the first 10 libs.\n     Optionally allow user to specify the source as cas or compute.",parameters:{properties:{limit:{type:"integer",description:"Return only this many libs. If not specified, then return 10 libs."},source:{type:"string",description:"The source of the data. cas or compute",enum:["cas","compute"]}},type:"object"}},_={name:"_listSASTables",description:"for a given library, lib or caslibs get the list of available tables\n    (ex: list tables for Samples)\n    Optionally let user specify the source as cas or compute.",parameters:{properties:{library:{type:"string",description:"A SAS library like casuser, sashelp, samples"},limit:{type:"integer",description:"Return only this many tables. If not specified, then return 10 tables."},source:{type:"string",description:"The source of the data. cas or compute",enum:["cas","compute"]}},type:"object",required:["library"]}},O={name:"_listColumns",description:"Get schema or columns for specified table. Table is of the form sashelp.cars",parameters:{properties:{table:{type:"string",description:"A table like sashelp.cars"}},type:"object",required:["table"]}},N={name:"_describeTable",description:"Describe the table like sashelp.cars . return information on the table like columns, types, keys. Optionally format the data",parameters:{properties:{table:{type:"string",description:"A table like sashelp.cars"},format:{type:"boolean",description:"If true then format the data"}},type:"object",required:["table"]}},q={name:"_runSAS",description:"run the specified file. The file is a path to the sas program",parameters:{properties:{file:{type:"string",description:"this is the file to run"}},type:"object",required:["file"]}},R={name:"_keywords",description:"format a comma-separated keywords like a,b,c into html, array, object",parameters:{properties:{keywords:{type:"string",description:"A comma-separated list of keywords like a,b,c"},format:{type:"string",enum:["html","array","object"],description:"Format the string"}},type:"object",required:["keywords","format"]}};function I(e,t){var n=function(e){return function(){var t=[].slice.call(arguments);return e.beta.assistants.retrieve(t[0])}},r=e;return"openai"===t&&(r={listAssistants:function(e){return function(){var t=[].slice.call(arguments);return e.beta.assistants.list(t[0])}}(e),createAssistant:function(e){return function(){var t=[].slice.call(arguments);return e.beta.assistants.create(t[0])}}(e),getAssistant:n(e),deleteAssistant:n(e),updateAssistant:function(e){return function(){var t=[].slice.call(arguments);return e.beta.assistants.update(t[0],t[1])}}(e),createThread:function(e){return function(){var t=[].slice.call(arguments)[0];return null==t&&(t={}),e.beta.threads.create(t)}}(e),getThread:function(e){return function(){var t=[].slice.call(arguments);return e.beta.threads.retrieve(t[0])}}(e),deleteThread:function(e){return function(){var t=[].slice.call(arguments);return e.beta.threads.del(t[0])}}(e),createMessage:function(e){return function(){var t=[].slice.call(arguments);return e.beta.threads.messages.create(t[0],{role:t[1],content:t[2]})}}(e),listMessages:function(e){return function(){var t=[].slice.call(arguments),n=t[0],r=t[1];return console.log(n,r),e.beta.threads.messages.list(n,r)}}(e),createRun:function(e){return function(){var t=[].slice.call(arguments),n=t[1];return e.beta.threads.runs.create(t[0],{assistant_id:n.assistantId,instructions:n.instructions})}}(e),getRun:function(e){return function(){var t=[].slice.call(arguments);return e.beta.threads.runs.retrieve(t[0],t[1])}}(e),listRuns:function(e){return function(){var t=[].slice.call(arguments);return e.beta.threads.runs.list(t[0])}}(e),cancelRun:function(e){return function(){var t=[].slice.call(arguments);return e.beta.threads.runs.cancel(t[0],t[1])}}(e),submitToolOutputsToRun:function(e){return function(){var t=[].slice.call(arguments);return e.beta.threads.runs.submitToolOutputs(t[0],t[1],t[2])}}(e)}),r}var D=function(r){try{var i,a=r.credentials,u=a.key,l=a.endPoint;i="openai"===r.provider?new e({apiKey:u,dangerouslyAllowBrowser:!0}):new t(l,new n(u,{}));var p,g=function(e){var t=[j,k,_,O,N,T,q,R],n=[{type:"code_interpreter"}];return"openai"===e&&n.push({type:"retrieval"}),t.forEach(function(e){var t={type:"function",function:Object.assign({},e)};n.push(t)}),{specs:t,tools:n,functionList:{_getData:d,_listSASObjects:y,_listSASTables:v,_listColumns:m,_listSASDataLib:b,_runSAS:h,_keywords:f,_describeTable:c},instructions:"\n You are a Assistant designed for SAS users. You can help SAS users with their SAS related questions and provide information\n  on topics like libraries, reports, tables. You can also fetch data from tables and run SAS programs. You can also help answer questions about the \n  data that has been returned from previous queries.\n\n  If the response from a tool is of the form [{a:1,b:2},{a:1,b:3}] format the table as a html table element like this\n  '<table>\n     <tr>\n       <th>a</th> \n      <th>b</th>\n     </tr>\n    <tr>\n    <td>1</td>\n    <td>2</td>\n    </tr>\n    <tr>\n   <td>2</td>\n   <td>3</td>\n   </tr>\n   </table>' \n  \n  if the response from a tool is of the form [1,2,3] then return the data as a html unodered list to the user.\n  You can also allow users to attach files to the assistant. \n\n  "}}(r.provider);p=!0===r.domainTools.replace?r.domainTools:{tools:r.domainTools.tools.concat(g.tools),functionList:Object.assign(r.domainTools.functionList,g.functionList),instructions:r.instructions?r.instructions+g.instructions:g.instructions};var P={provider:r.provider,model:r.model,domainTools:p,instructions:p.userInstructions,assistantName:r.assistantName,assistant:null,assistantid:r.assistantid,thread:null,threadid:r.threadid,appEnv:null,client:i,run:null,assistantApi:I(i,r.provider)};return Promise.resolve(function(e){try{var t={host:null,logonPayload:null,store:null,source:"none",currentSource:"none",session:null,servers:null,serverName:null,casServerName:null,sessionID:null,compute:{},cas:{},userData:null};if(null==e)return Promise.resolve(t);if("none"==e.source)return t.userData=e.userData,t.logonPayload=e.logonPayload,t.currentSource="none",Promise.resolve(t);var n=e.source,r=e.logonPayload,i=n.split(",")[0];t.currentSource=i,t.host=r.host;var a=o.initStore({casProxy:!0});return Promise.resolve(a.logon(r)).then(function(){function e(){function e(){return console.log(t),t}var r=function(){if(n.indexOf("compute")>0)return t.compute={servers:null},Promise.resolve(s.computeSetup(a)).then(function(e){return Promise.resolve(a.apiCall(t.session.links("self"))).then(function(n){t.compute.sessionID=n.items("id"),"compute"===i&&(t.source="compute",t.session=e,t.servers=null,t.serverName=null,t.sessionID=t.compute.sessionID)})})}();return r&&r.then?r.then(e):e()}t.host=r.host,t.logonPayload=r,t.store=a;var o=function(){if(n.indexOf("cas")>=0)return Promise.resolve(s.casSetup(a,null)).then(function(e){var n=e.session,r=e.servers,s=n.links("execute","link","server");return t.cas={session:n,servers:r,casServerName:s},Promise.resolve(a.apiCall(n.links("self"))).then(function(e){t.cas.sessionID=e.items("id"),"cas"===i&&(t.source="cas",t.session=n,t.servers=r,t.serverName=s,t.casServerName=s,t.sessionID=t.cas.sessionID)})})}();return o&&o.then?o.then(e):e()})}catch(e){return Promise.reject(e)}}(r.viyaConfig)).then(function(e){return P.appEnv=e,Promise.resolve(function(e){try{var t=function(){return e.assistantid=i.id,e.assistant=i,i},n=e.assistantName,r=e.assistantid,s=e.assistantApi,o={name:n,instructions:e.instructions,model:e.model,tools:e.domainTools.tools},i=null,a="0"===r||null==r,u=function(){if(0==a)return Promise.resolve(s.getAssistant(r)).then(function(e){i=e});var e=function(){if(null!=n)return Promise.resolve(s.listAssistants({order:"desc",limit:"100"})).then(function(e){i=e.data.find(function(e){if(e.name===n)return e});var t=function(){if(null==i)return console.log("Creating new assistant"),Promise.resolve(s.createAssistant(o)).then(function(e){i=e})}();if(t&&t.then)return t.then(function(){})})}();return e&&e.then?e.then(function(){}):void 0}();return Promise.resolve(u&&u.then?u.then(t):t())}catch(e){return Promise.reject(e)}}(P)).then(function(e){return P.assistant=e,Promise.resolve(function(e){try{var t=function(e){return s},n=e.assistant,r=e.assistantApi,s=null,o=e.threadid,i=function(t,i){try{var a=function(){"-1"===o&&(o=n.metadata.lastThread);var t="0"===o||null==o?(console.log("Creating new thread"),Promise.resolve(r.createThread()).then(function(t){return s=t,Promise.resolve(r.updateAssistant(n.id,{metadata:{lastThread:s.id}})).then(function(t){e.assistant=t})})):Promise.resolve(r.getThread(o)).then(function(e){s=e});if(t&&t.then)return t.then(function(){})}()}catch(e){return i(e)}return a&&a.then?a.then(void 0,i):a}(0,function(e){throw console.log(e),new Error("Error status "+e.status+". Failed to create thread. See console for details.")});return Promise.resolve(i&&i.then?i.then(t):t())}catch(e){return Promise.reject(e)}}(P)).then(function(e){return P.thread=e,P.threadid=P.thread.id,P})})})}catch(e){return Promise.reject(e)}},C=function(e,t){try{return Promise.resolve(e.assistantApi.listMessages(e.thread.id,{limit:t})).then(function(e){for(var t=[],n=e.data,r=0;r<e.data.length;r++){var s=n[r].content[0];if("assistant"!==n[r].role)break;t.push({id:n[r].id,role:n[r].role,type:s.type,content:s[s.type].value})}return t.length>1&&(t=t.reverse()),t})}catch(e){return Promise.reject(e)}};function J(e,t,n){if(!e.s){if(n instanceof L){if(!n.s)return void(n.o=J.bind(null,e,t));1&t&&(t=n.s),n=n.v}if(n&&n.then)return void n.then(J.bind(null,e,t),J.bind(null,e,2));e.s=t,e.v=n;var r=e.o;r&&r(e)}}var E=function(e,t){try{var n=t.assistantApi,r=t.thread,s=null,o=null,i=function(e,t){var n;do{var r=e();if(r&&r.then){if(!x(r)){n=!0;break}r=r.v}var s=t();if(x(s)&&(s=s.v),!s)return r}while(!s.then);var o=new L,i=J.bind(null,o,2);return(n?r.then(a):s.then(u)).then(void 0,i),o;function a(n){for(r=n;x(s=t())&&(s=s.v),s;){if(s.then)return void s.then(u).then(void 0,i);if((r=e())&&r.then){if(!x(r))return void r.then(a).then(void 0,i);r=r.v}}J(o,1,r)}function u(n){if(n){do{if((r=e())&&r.then){if(!x(r))return void r.then(a).then(void 0,i);r=r.v}if(x(n=t())&&(n=n.v),!n)return void J(o,1,r)}while(!n.then);n.then(u).then(void 0,i)}else J(o,1,r)}}(function(){return Promise.resolve(n.getRun(r.id,e.id)).then(function(e){o=e,console.log("-------------------",o.status);var t=function(){if("queued"===o.status||"in_progress"===o.status||"cancelling"===o.status)return Promise.resolve(new Promise(function(e){return setTimeout(e,2e3)})).then(function(){console.log("waited 2000 ms")});s=o.status}();if(t&&t.then)return t.then(function(){})})},function(){return null===s});return Promise.resolve(i&&i.then?i.then(function(){return o}):o)}catch(e){return Promise.reject(e)}};const L=/*#__PURE__*/function(){function e(){}return e.prototype.then=function(t,n){const r=new e,s=this.s;if(s){const e=1&s?t:n;if(e){try{J(r,1,e(this.v))}catch(e){J(r,2,e)}return r}return this}return this.o=function(e){try{const s=e.v;1&e.s?J(r,1,t?t(s):s):n?J(r,1,n(s)):J(r,2,s)}catch(e){J(r,2,e)}},r},e}();function x(e){return e instanceof L&&1&e.s}const F="undefined"!=typeof Symbol?Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator")):"@@iterator";function M(e,t,n){if(!e.s){if(n instanceof Y){if(!n.s)return void(n.o=M.bind(null,e,t));1&t&&(t=n.s),n=n.v}if(n&&n.then)return void n.then(M.bind(null,e,t),M.bind(null,e,2));e.s=t,e.v=n;var r=e.o;r&&r(e)}}var Y=/*#__PURE__*/function(){function e(){}return e.prototype.then=function(t,n){var r=new e,s=this.s;if(s){var o=1&s?t:n;if(o){try{M(r,1,o(this.v))}catch(e){M(r,2,e)}return r}return this}return this.o=function(e){try{var s=e.v;1&e.s?M(r,1,t?t(s):s):n?M(r,1,n(s)):M(r,2,s)}catch(e){M(r,2,e)}},r},e}();function G(e){return e instanceof Y&&1&e.s}function U(e,t,n){return"openai"===n?{tool_call_id:e,output:JSON.stringify(t)}:{toolCallId:e,output:JSON.stringify(t)}}var z=function(e,t,n){try{var r,s=function(t){return r?t:Promise.resolve(function(e,t,n){try{return Promise.resolve(e.assistantApi.createRun(e.thread.id,{assistantId:e.assistant.id,instructions:null!=n?n:""})).then(function(t){return e.run=t,Promise.resolve(E(t,e)).then(function(t){var n,r=function(){if("completed"===t.status)return Promise.resolve(C(e,5)).then(function(e){n=e});var r=function(){if("requires_action"===t.status)return Promise.resolve(function(e,t){try{var n=function(){return console.log("Adding output to messages"),console.log("toolsOutput",l),console.log(o),console.log(l),Promise.resolve(r.submitToolOutputsToRun(i.id,a.id,"openai"===o?{tool_outputs:l}:l)).then(function(e){return Promise.resolve(E(e,t))})},r=t.assistantApi,s=t.appEnv,o=t.provider,i=t.thread,a=t.run,u=t.domainTools.functionList,l=[],c=function(e,t,n){if("function"==typeof e[F]){var r,s,o,i=e[F]();if(function e(n){try{for(;!(r=i.next()).done;)if((n=t(r.value))&&n.then){if(!G(n))return void n.then(e,o||(o=M.bind(null,s=new Y,2)));n=n.v}s?M(s,1,n):s=n}catch(e){M(s||(s=new Y),2,e)}}(),i.return){var a=function(e){try{r.done||i.return()}catch(e){}return e};if(s&&s.then)return s.then(a,function(e){throw a(e)});a()}return s}if(!("length"in e))throw new TypeError("Object is not iterable");for(var u=[],l=0;l<e.length;l++)u.push(e[l]);return function(e,t,n){var r,s,o=-1;return function n(i){try{for(;++o<e.length;)if((i=t(o))&&i.then){if(!G(i))return void i.then(n,s||(s=M.bind(null,r=new Y,2)));i=i.v}r?M(r,1,i):r=i}catch(e){M(r||(r=new Y),2,e)}}(),r}(u,function(e){return t(u[e])})}("openai"===o?e.required_action.submit_tool_outputs.tool_calls:e.requiredAction.submitToolOutputs.toolCalls,function(e){var n=e.function.name;console.log("Requested function: ",n);var r=JSON.parse(e.function.arguments),i=u[n],a=function(){if(null==i)l.push(U(e.id,"Function "+n+" not found. \n      Probable causes: \n        Using thread that had outdated tool references.\n        Currrent specs point has mistmatch with function name\n        ",o));else{var a=function(i,a){try{var c=Promise.resolve(u[n](r,s,t)).then(function(t){console.log("Response from function: ",t),l.push("openai"===o?{tool_call_id:e.id,output:JSON.stringify(t)}:{toolCallId:e.id,output:JSON.stringify(t)})})}catch(e){return a(e)}return c&&c.then?c.then(void 0,a):c}(0,function(t){l.push(U(e.id,t,o))});if(a&&a.then)return a.then(function(){})}}();if(a&&a.then)return a.then(function(){})});return Promise.resolve(c&&c.then?c.then(n):n())}catch(e){return Promise.reject(e)}}(t,e)).then(function(t){return console.log("getting latest message "),Promise.resolve(C(e,5)).then(function(e){n=e})});n=[{runStatus:t.status}]}();return r&&r.then?r.then(function(){}):void 0}();return r&&r.then?r.then(function(){return n}):n})})}catch(e){return Promise.reject(e)}}(e,0,n))},o=e.thread,i=e.assistantApi,a=function(e,n){try{var r=Promise.resolve(i.createMessage(o.id,"user",t)).then(function(){})}catch(e){return n(e)}return r&&r.then?r.then(void 0,n):r}(0,function(e){console.log(e.status),console.log(e.error);var t=JSON.stringify(e.error);return r=1,t});return Promise.resolve(a&&a.then?a.then(s):s(a))}catch(e){return Promise.reject(e)}},B=function(e,t){try{console.log("in closeAssistant");var n=e.assistantApi,r=t||e.assistant.id;return Promise.resolve(function(){if(null!=r)return Promise.resolve(n.deleteAssistant(r))}())}catch(e){return Promise.reject(e)}},K=function(e,t){try{return Promise.resolve(e.assistantApi.listMessages(e.thread.id,{limit:t})).then(function(e){return e.data.map(function(e){var t=e.content[0];return{id:e.id,role:e.role,type:t.type,content:t[t.type].value}})})}catch(e){return Promise.reject(e)}},H=function(e,t,n){try{var r=n.client,s=n.assistant;return Promise.resolve(r.files.create({file:e,purpose:t})).then(function(e){console.log(".......................",e);var t=[].concat(s.file_ids);t.push(e.id),console.log(t);var o=function(e,o){try{var i=Promise.resolve(r.beta.assistants.update(s.id,{file_ids:t})).then(function(e){n.assistant=e,console.log(".......................",e)})}catch(e){return o(e)}return i&&i.then?i.then(void 0,o):i}(0,function(e){console.log(e)});return o&&o.then?o.then(function(){return t}):t})}catch(e){return Promise.reject(e)}};function Q(e,t){try{var n=e()}catch(e){return t(e)}return n&&n.then?n.then(void 0,t):n}var V=function(e,t,n){try{var r,s=function(e){var t;if(r)return e;if(null===a||null===i)return console.log("No run or thread to cancel"),null;var n=null,s=Q(function(){return Promise.resolve(o.getRun(i.id,a.id)).then(function(e){return console.log(e),null!==e.completed||"cancelling"===e.status?(console.log("Run "+a.id+" status: "+e.status+" , completed: "+e.completed),t=1,null):Promise.resolve(o.cancelRun(i.id,a.id)).then(function(e){n=e})})},function(e){console.log("Error cancelling the run",e)});return s&&s.then?s.then(function(e){return t?e:n}):t?s:n},o=e.assistantApi,i=e.thread,a=e.run,u=function(){if(null!=t||null!=n)return Q(function(){return console.log("Cancelling run",t,n),Promise.resolve(o.cancelRun(t,n)).then(function(e){return r=1,e})},function(e){return console.log("Error cancelling the run ",e,t,n),r=1,null})}();return Promise.resolve(u&&u.then?u.then(s):s(u))}catch(e){return Promise.reject(e)}};export{V as cancelRun,B as deleteAssistant,C as getLatestMessage,K as getMessages,z as runAssistant,D as setupAssistant,H as uploadFile};
//# sourceMappingURL=index.module.js.map
