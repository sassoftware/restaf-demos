import t from"openai";import{OpenAIClient as e,OpenAIKeyCredential as n}from"@azure/openai";var r=function(t,e,n,r){try{var o=function(){function e(){return{thread:i,assistant:n}}var r=function(){if(null==i)return console.log("Creating new thread"),Promise.resolve(t.beta.threads.create({metadata:{assistanceName:n.name}})).then(function(e){return i=e,Promise.resolve(t.beta.assistants.update(n.id,{metadata:{thread_id:i.id,lastRunId:"0"}})).then(function(t){n=t})})}();return r&&r.then?r.then(e):e()},i=null,s=function(){if(!0===r&&"0"!=e){var n=function(n,r){try{var o=Promise.resolve(t.beta.threads.retrieve(e)).then(function(t){i=t})}catch(t){return r(t)}return o&&o.then?o.then(void 0,r):o}(0,function(t){console.log(t),console.log(t.status),console.log("Error status "+t.status+". Unable to retrieve the thread "+thread_id)});if(n&&n.then)return n.then(function(){})}}();return Promise.resolve(s&&s.then?s.then(o):o())}catch(t){return Promise.reject(t)}},o=function(o){try{var i=o.provider,s=o.assistantName,a=o.credentials,u="openai"===i?a.openaiKey:a.azureaiKey,c=a.azureaiEndpoint;console.log(u);var l="openai"===i?new t({apiKey:u,dangerouslyAllowBrowser:!0}):new e(c,new n(u));return Promise.resolve(l.beta.assistants.list({order:"desc",limit:"100"})).then(function(t){var e=t.data.find(function(t){if(t.name===s)return t});return Promise.resolve(null==e?function(t,e){try{var n=e.assistantName,o=e.specs,i=e.reuseThread,s={name:n,instructions:e.instructions,model:e.model,metadata:{thread_id:"0",lastRunId:"0"}};return null!=o.tools&&(s.tools=o.tools),Promise.resolve(t.beta.assistants.create(s)).then(function(s){return console.log("-----------------------------------"),console.log("New Assistant: ",n,s.id),Promise.resolve(r(t,e.threadid,s,i)).then(function(e){return console.log("Thread ID: ",e.thread.id),console.log("-----------------------------------"),{openai:t,assistant:e.assistant,thread:e.thread,threadid:e.thread.id,specs:o}})})}catch(t){return Promise.reject(t)}}(l,o):function(t,e,n){try{var o=n.reuseThread;console.log("Using Existing Assistant: ",e.name,e.id);var i=e.metadata.thread_id;return"0"!==n.threadid&&(i=n.threadid),console.log("Associated thread_id: ",i),Promise.resolve(r(t,i,e,o)).then(function(e){return{openai:t,assistant:e.assistant,thread:e.thread,threadid:e.thread.id,specs:n.specs}})}catch(t){return Promise.reject(t)}}(l,e,o))})}catch(t){return Promise.reject(t)}},i=function(t,e,n){try{return Promise.resolve(t.beta.threads.messages.list(e.id,{limit:n})).then(function(t){var e=t.data[0].content[0];return e[e.type].value})}catch(t){return Promise.reject(t)}};function s(t,e,n){if(!t.s){if(n instanceof u){if(!n.s)return void(n.o=s.bind(null,t,e));1&e&&(e=n.s),n=n.v}if(n&&n.then)return void n.then(s.bind(null,t,e),s.bind(null,t,2));t.s=e,t.v=n;var r=t.o;r&&r(t)}}var a=function(t,e,n){try{var r=function(){return Promise.resolve(o.beta.assistants.update(i.id,{metadata:{thread_id:t.id,lastRunId:e.id}})).then(function(t){return n.assistant=t,l})},o=n.openai,i=n.assistant,a=null,l=null,h=function(t,e){var n;do{var r=t();if(r&&r.then){if(!c(r)){n=!0;break}r=r.v}var o=e();if(c(o)&&(o=o.v),!o)return r}while(!o.then);var i=new u,a=s.bind(null,i,2);return(n?r.then(l):o.then(h)).then(void 0,a),i;function l(n){for(r=n;c(o=e())&&(o=o.v),o;){if(o.then)return void o.then(h).then(void 0,a);if((r=t())&&r.then){if(!c(r))return void r.then(l).then(void 0,a);r=r.v}}s(i,1,r)}function h(n){if(n){do{if((r=t())&&r.then){if(!c(r))return void r.then(l).then(void 0,a);r=r.v}if(c(n=e())&&(n=n.v),!n)return void s(i,1,r)}while(!n.then);n.then(h).then(void 0,a)}else s(i,1,r)}}(function(){return Promise.resolve(o.beta.threads.runs.retrieve(t.id,e.id)).then(function(t){l=t,console.log("-------------------",l.status);var e=function(){if("queued"===l.status||"in_progress"===l.status||"cancelling"===l.status)return Promise.resolve(new Promise(function(t){return setTimeout(t,2e3)})).then(function(){});a=l.status}();if(e&&e.then)return e.then(function(){})})},function(){return null===a});return Promise.resolve(h&&h.then?h.then(r):r())}catch(t){return Promise.reject(t)}};const u=/*#__PURE__*/function(){function t(){}return t.prototype.then=function(e,n){const r=new t,o=this.s;if(o){const t=1&o?e:n;if(t){try{s(r,1,t(this.v))}catch(t){s(r,2,t)}return r}return this}return this.o=function(t){try{const o=t.v;1&t.s?s(r,1,e?e(o):o):n?s(r,1,n(o)):s(r,2,o)}catch(t){s(r,2,t)}},r},t}();function c(t){return t instanceof u&&1&t.s}var l="undefined"!=typeof Symbol?Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator")):"@@iterator";function h(t,e,n){if(!t.s){if(n instanceof d){if(!n.s)return void(n.o=h.bind(null,t,e));1&e&&(e=n.s),n=n.v}if(n&&n.then)return void n.then(h.bind(null,t,e),h.bind(null,t,2));t.s=e,t.v=n;var r=t.o;r&&r(t)}}var d=/*#__PURE__*/function(){function t(){}return t.prototype.then=function(e,n){var r=new t,o=this.s;if(o){var i=1&o?e:n;if(i){try{h(r,1,i(this.v))}catch(t){h(r,2,t)}return r}return this}return this.o=function(t){try{var o=t.v;1&t.s?h(r,1,e?e(o):o):n?h(r,1,n(o)):h(r,2,o)}catch(t){h(r,2,t)}},r},t}();function f(t){return t instanceof d&&1&t.s}var v=function(t,e,n,r){try{var o,s=function(t){return o?t:Promise.resolve(u.beta.threads.runs.create(v.id,{assistant_id:c.id,instructions:null!=r?r:""})).then(function(t){return m=t,Promise.resolve(a(v,m,e)).then(function(t){return"completed"===t.status?Promise.resolve(i(u,v,1)):"requires_action"===t.status?Promise.resolve(function(t,e,n,r,o){try{var i=function(){return Promise.resolve(s.beta.threads.runs.submitToolOutputs(e.id,n.id,{tool_outputs:c})).then(function(t){return Promise.resolve(a(e,t,r))})},s=r.openai,u=r.specs.functionList,c=[],v=function(t,e,n){if("function"==typeof t[l]){var r,o,i,s=t[l]();if(function t(n){try{for(;!(r=s.next()).done;)if((n=e(r.value))&&n.then){if(!f(n))return void n.then(t,i||(i=h.bind(null,o=new d,2)));n=n.v}o?h(o,1,n):o=n}catch(t){h(o||(o=new d),2,t)}}(),s.return){var a=function(t){try{r.done||s.return()}catch(t){}return t};if(o&&o.then)return o.then(a,function(t){throw a(t)});a()}return o}if(!("length"in t))throw new TypeError("Object is not iterable");for(var u=[],c=0;c<t.length;c++)u.push(t[c]);return function(t,e,n){var r,o,i=-1;return function n(s){try{for(;++i<t.length;)if((s=e(i))&&s.then){if(!f(s))return void s.then(n,o||(o=h.bind(null,r=new d,2)));s=s.v}r?h(r,1,s):r=s}catch(t){h(r||(r=new d),2,t)}}(),r}(u,function(t){return e(u[t])})}(t.required_action.submit_tool_outputs.tool_calls,function(t){var e=t.function.name;console.log("Requested function: ",e);var n=JSON.parse(t.function.arguments);return Promise.resolve(u[e](n,o,r)).then(function(e){c.push({tool_call_id:t.id,output:JSON.stringify(e)})})});return Promise.resolve(v&&v.then?v.then(i):i())}catch(t){return Promise.reject(t)}}(t,v,m,e,n)).then(function(t){return Promise.resolve(i(u,v,1))}):{runStatus:t.status}})})},u=e.openai,c=e.assistant,v=e.thread,m=null,p=function(e,n){try{var r=Promise.resolve(u.beta.threads.messages.create(v.id,{role:"user",content:t})).then(function(t){})}catch(t){return n(t)}return r&&r.then?r.then(void 0,n):r}(0,function(t){return console.log("status = "+t.status+". Unable to add the prompt to the thread"),console.log("will try to cancel the last run"),o=1,{status:t.status,message:t}});return Promise.resolve(p&&p.then?p.then(s):s(p))}catch(t){return Promise.reject(t)}},m=function(t,e){try{return console.log("in closeAssistant"),Promise.resolve(!0)}catch(t){return Promise.reject(t)}},p=function(t,e){try{return Promise.resolve(t.openai.beta.threads.messages.list(t.thread.id,{limit:e})).then(function(t){return t.data.map(function(t){var e=t.content[0];return{id:t.id,role:t.role,type:e.type,content:e[e.type].value}})})}catch(t){return Promise.reject(t)}};export{m as closeAssistant,i as getLatestMessage,p as getMessages,v as runAssistant,o as setupAssistant};
//# sourceMappingURL=index.module.js.map
