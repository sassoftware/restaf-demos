!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("openai"),require("@azure/openai")):"function"==typeof define&&define.amd?define(["exports","openai","@azure/openai"],e):e((t||self).assistantjs={},t.openai,t.openai)}(this,function(t,e,n){function r(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}var i=/*#__PURE__*/r(e),o=function(t,e,n,r){try{var i=function(){function e(){return{thread:o,assistant:n}}var r=function(){if(null==o)return console.log("Creating new thread"),Promise.resolve(t.beta.threads.create({metadata:{assistanceName:n.name}})).then(function(e){return o=e,Promise.resolve(t.beta.assistants.update(n.id,{metadata:{thread_id:o.id,lastRunId:"0"}})).then(function(t){n=t})})}();return r&&r.then?r.then(e):e()},o=null,s=function(){if(!0===r&&"0"!=e){var n=function(n,r){try{var i=Promise.resolve(t.beta.threads.retrieve(e)).then(function(t){o=t})}catch(t){return r(t)}return i&&i.then?i.then(void 0,r):i}(0,function(t){console.log(t),console.log(t.status),console.log("Error status "+t.status+". Unable to retrieve the thread "+thread_id)});if(n&&n.then)return n.then(function(){})}}();return Promise.resolve(s&&s.then?s.then(i):i())}catch(t){return Promise.reject(t)}},s=function(t,e,n){try{return Promise.resolve(t.beta.threads.messages.list(e.id,{limit:n})).then(function(t){var e=t.data[0].content[0];return e[e.type].value})}catch(t){return Promise.reject(t)}};function a(t,e,n){if(!t.s){if(n instanceof c){if(!n.s)return void(n.o=a.bind(null,t,e));1&e&&(e=n.s),n=n.v}if(n&&n.then)return void n.then(a.bind(null,t,e),a.bind(null,t,2));t.s=e,t.v=n;var r=t.o;r&&r(t)}}var u=function(t,e,n){try{var r=function(){return Promise.resolve(i.beta.assistants.update(o.id,{metadata:{thread_id:t.id,lastRunId:e.id}})).then(function(t){return n.assistant=t,u})},i=n.openai,o=n.assistant,s=null,u=null,d=function(t,e){var n;do{var r=t();if(r&&r.then){if(!l(r)){n=!0;break}r=r.v}var i=e();if(l(i)&&(i=i.v),!i)return r}while(!i.then);var o=new c,s=a.bind(null,o,2);return(n?r.then(u):i.then(d)).then(void 0,s),o;function u(n){for(r=n;l(i=e())&&(i=i.v),i;){if(i.then)return void i.then(d).then(void 0,s);if((r=t())&&r.then){if(!l(r))return void r.then(u).then(void 0,s);r=r.v}}a(o,1,r)}function d(n){if(n){do{if((r=t())&&r.then){if(!l(r))return void r.then(u).then(void 0,s);r=r.v}if(l(n=e())&&(n=n.v),!n)return void a(o,1,r)}while(!n.then);n.then(d).then(void 0,s)}else a(o,1,r)}}(function(){return Promise.resolve(i.beta.threads.runs.retrieve(t.id,e.id)).then(function(t){u=t,console.log("-------------------",u.status);var e=function(){if("queued"===u.status||"in_progress"===u.status||"cancelling"===u.status)return Promise.resolve(new Promise(function(t){return setTimeout(t,2e3)})).then(function(){});s=u.status}();if(e&&e.then)return e.then(function(){})})},function(){return null===s});return Promise.resolve(d&&d.then?d.then(r):r())}catch(t){return Promise.reject(t)}};const c=/*#__PURE__*/function(){function t(){}return t.prototype.then=function(e,n){const r=new t,i=this.s;if(i){const t=1&i?e:n;if(t){try{a(r,1,t(this.v))}catch(t){a(r,2,t)}return r}return this}return this.o=function(t){try{const i=t.v;1&t.s?a(r,1,e?e(i):i):n?a(r,1,n(i)):a(r,2,i)}catch(t){a(r,2,t)}},r},t}();function l(t){return t instanceof c&&1&t.s}var d="undefined"!=typeof Symbol?Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator")):"@@iterator";function h(t,e,n){if(!t.s){if(n instanceof f){if(!n.s)return void(n.o=h.bind(null,t,e));1&e&&(e=n.s),n=n.v}if(n&&n.then)return void n.then(h.bind(null,t,e),h.bind(null,t,2));t.s=e,t.v=n;var r=t.o;r&&r(t)}}var f=/*#__PURE__*/function(){function t(){}return t.prototype.then=function(e,n){var r=new t,i=this.s;if(i){var o=1&i?e:n;if(o){try{h(r,1,o(this.v))}catch(t){h(r,2,t)}return r}return this}return this.o=function(t){try{var i=t.v;1&t.s?h(r,1,e?e(i):i):n?h(r,1,n(i)):h(r,2,i)}catch(t){h(r,2,t)}},r},t}();function v(t){return t instanceof f&&1&t.s}t.closeAssistant=function(t,e){try{return console.log("in closeAssistant"),Promise.resolve(!0)}catch(t){return Promise.reject(t)}},t.getLatestMessage=s,t.getMessages=function(t,e){try{return Promise.resolve(t.openai.beta.threads.messages.list(t.thread.id,{limit:e})).then(function(t){return t.data.map(function(t){var e=t.content[0];return{id:t.id,role:t.role,type:e.type,content:e[e.type].value}})})}catch(t){return Promise.reject(t)}},t.runAssistant=function(t,e,n,r){try{var i,o=function(t){return i?t:Promise.resolve(a.beta.threads.runs.create(l.id,{assistant_id:c.id,instructions:null!=r?r:""})).then(function(t){return m=t,Promise.resolve(u(l,m,e)).then(function(t){return"completed"===t.status?Promise.resolve(s(a,l,1)):"requires_action"===t.status?Promise.resolve(function(t,e,n,r,i){try{var o=function(){return Promise.resolve(s.beta.threads.runs.submitToolOutputs(e.id,n.id,{tool_outputs:c})).then(function(t){return Promise.resolve(u(e,t,r))})},s=r.openai,a=r.specs.functionList,c=[],l=function(t,e,n){if("function"==typeof t[d]){var r,i,o,s=t[d]();if(function t(n){try{for(;!(r=s.next()).done;)if((n=e(r.value))&&n.then){if(!v(n))return void n.then(t,o||(o=h.bind(null,i=new f,2)));n=n.v}i?h(i,1,n):i=n}catch(t){h(i||(i=new f),2,t)}}(),s.return){var a=function(t){try{r.done||s.return()}catch(t){}return t};if(i&&i.then)return i.then(a,function(t){throw a(t)});a()}return i}if(!("length"in t))throw new TypeError("Object is not iterable");for(var u=[],c=0;c<t.length;c++)u.push(t[c]);return function(t,e,n){var r,i,o=-1;return function n(s){try{for(;++o<t.length;)if((s=e(o))&&s.then){if(!v(s))return void s.then(n,i||(i=h.bind(null,r=new f,2)));s=s.v}r?h(r,1,s):r=s}catch(t){h(r||(r=new f),2,t)}}(),r}(u,function(t){return e(u[t])})}(t.required_action.submit_tool_outputs.tool_calls,function(t){var e=t.function.name;console.log("Requested function: ",e);var n=JSON.parse(t.function.arguments);return Promise.resolve(a[e](n,i,r)).then(function(e){c.push({tool_call_id:t.id,output:JSON.stringify(e)})})});return Promise.resolve(l&&l.then?l.then(o):o())}catch(t){return Promise.reject(t)}}(t,l,m,e,n)).then(function(t){return Promise.resolve(s(a,l,1))}):{runStatus:t.status}})})},a=e.openai,c=e.assistant,l=e.thread,m=null,p=function(e,n){try{var r=Promise.resolve(a.beta.threads.messages.create(l.id,{role:"user",content:t})).then(function(t){})}catch(t){return n(t)}return r&&r.then?r.then(void 0,n):r}(0,function(t){return console.log("status = "+t.status+". Unable to add the prompt to the thread"),console.log("will try to cancel the last run"),i=1,{status:t.status,message:t}});return Promise.resolve(p&&p.then?p.then(o):o(p))}catch(t){return Promise.reject(t)}},t.setupAssistant=function(t){try{var e=t.provider,r=t.assistantName,s=t.credentials,a="openai"===e?s.openaiKey:s.azureaiKey,u=s.azureaiEndpoint;console.log(a);var c="openai"===e?new i.default({apiKey:a,dangerouslyAllowBrowser:!0}):new n.OpenAIClient(u,new n.OpenAIKeyCredential(a));return Promise.resolve(c.beta.assistants.list({order:"desc",limit:"100"})).then(function(e){var n=e.data.find(function(t){if(t.name===r)return t});return Promise.resolve(null==n?function(t,e){try{var n=e.assistantName,r=e.specs,i=e.reuseThread,s={name:n,instructions:e.instructions,model:e.model,metadata:{thread_id:"0",lastRunId:"0"}};return null!=r.tools&&(s.tools=r.tools),Promise.resolve(t.beta.assistants.create(s)).then(function(s){return console.log("-----------------------------------"),console.log("New Assistant: ",n,s.id),Promise.resolve(o(t,e.threadid,s,i)).then(function(e){return console.log("Thread ID: ",e.thread.id),console.log("-----------------------------------"),{openai:t,assistant:e.assistant,thread:e.thread,threadid:e.thread.id,specs:r}})})}catch(t){return Promise.reject(t)}}(c,t):function(t,e,n){try{var r=n.reuseThread;console.log("Using Existing Assistant: ",e.name,e.id);var i=e.metadata.thread_id;return"0"!==n.threadid&&(i=n.threadid),console.log("Associated thread_id: ",i),Promise.resolve(o(t,i,e,r)).then(function(e){return{openai:t,assistant:e.assistant,thread:e.thread,threadid:e.thread.id,specs:n.specs}})}catch(t){return Promise.reject(t)}}(c,n,t))})}catch(t){return Promise.reject(t)}}});
//# sourceMappingURL=index.umd.js.map
