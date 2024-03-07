import t from"openai";var n=function(n){try{var e=new t({apiKey:n.credentials.key,dangerouslyAllowBrowser:!0}),r={provider:"openai",client:e,assistant:null,thread:null,threadid:null,specs:n.domainTools,appEnv:null,config:n};return Promise.resolve(function(t,n){try{var e=function(){return u},r=n.assistantName,o=n.assistantid,i=n.domainTools,s={name:r,instructions:n.instructions,model:n.model};null!=i.tools&&(s.tools=i.tools);var u=null;console.log(o);var a="0"===o||null==o,c=function(){if(0==a)return Promise.resolve(t.beta.assistants.retrieve(o)).then(function(t){u=t});var n=function(){if(null!=r)return Promise.resolve(t.beta.assistants.list({order:"desc",limit:"100"})).then(function(n){u=n.data.find(function(t){if(t.name===r)return t});var e=function(){if(null==u)return Promise.resolve(t.beta.assistants.create(s)).then(function(t){u=t})}();if(e&&e.then)return e.then(function(){})})}();return n&&n.then?n.then(function(){}):void 0}();return Promise.resolve(c&&c.then?c.then(e):e())}catch(t){return Promise.reject(t)}}(e,n)).then(function(t){return r.assistant=t,Promise.resolve(function(t,n){try{var e=function(t){return o},r=n.threadid,o=null,i=function(n,e){try{var i=Promise.resolve("0"===r?t.beta.threads.create({metadata:{assistantName:assistant.name}}):t.beta.threads.retrieve(r)).then(function(t){o=t})}catch(t){return e(t)}return i&&i.then?i.then(void 0,e):i}(0,function(t){throw console.log(t),console.log(t.status),new Error("Error status "+t.status+". Unable to retrieve the thread "+r+". see console for details.")});return Promise.resolve(i&&i.then?i.then(e):e())}catch(t){return Promise.reject(t)}}(e,n)).then(function(t){return r.thread=t,r.threadid=r.thread.id,r})})}catch(t){return Promise.reject(t)}},e=function(t,n){try{return Promise.resolve(t.client.beta.threads.messages.list(t.thread.id,{limit:n})).then(function(t){for(var n=[],e=t.data,r=0;r<t.data.length;r++){var o=e[r].content[0];if("assistant"!==e[r].role)break;n.push({id:e[r].id,role:e[r].role,type:o.type,content:o[o.type].value})}return n.length>1&&(n=n.reverse()),n})}catch(t){return Promise.reject(t)}};function r(t,n,e){if(!t.s){if(e instanceof i){if(!e.s)return void(e.o=r.bind(null,t,n));1&n&&(n=e.s),e=e.v}if(e&&e.then)return void e.then(r.bind(null,t,n),r.bind(null,t,2));t.s=n,t.v=e;var o=t.o;o&&o(t)}}var o=function(t,n,e){try{var o=e.client,u=null,a=null,c=function(t,n){var e;do{var o=t();if(o&&o.then){if(!s(o)){e=!0;break}o=o.v}var u=n();if(s(u)&&(u=u.v),!u)return o}while(!u.then);var a=new i,c=r.bind(null,a,2);return(e?o.then(l):u.then(f)).then(void 0,c),a;function l(e){for(o=e;s(u=n())&&(u=u.v),u;){if(u.then)return void u.then(f).then(void 0,c);if((o=t())&&o.then){if(!s(o))return void o.then(l).then(void 0,c);o=o.v}}r(a,1,o)}function f(e){if(e){do{if((o=t())&&o.then){if(!s(o))return void o.then(l).then(void 0,c);o=o.v}if(s(e=n())&&(e=e.v),!e)return void r(a,1,o)}while(!e.then);e.then(f).then(void 0,c)}else r(a,1,o)}}(function(){return Promise.resolve(o.beta.threads.runs.retrieve(t.id,n.id)).then(function(t){a=t,console.log("-------------------",a.status);var n=function(){if("queued"===a.status||"in_progress"===a.status||"cancelling"===a.status)return Promise.resolve(new Promise(function(t){return setTimeout(t,2e3)})).then(function(){console.log("waited 2000 ms")});u=a.status}();if(n&&n.then)return n.then(function(){})})},function(){return null===u});return Promise.resolve(c&&c.then?c.then(function(){return a}):a)}catch(t){return Promise.reject(t)}};const i=/*#__PURE__*/function(){function t(){}return t.prototype.then=function(n,e){const o=new t,i=this.s;if(i){const t=1&i?n:e;if(t){try{r(o,1,t(this.v))}catch(t){r(o,2,t)}return o}return this}return this.o=function(t){try{const i=t.v;1&t.s?r(o,1,n?n(i):i):e?r(o,1,e(i)):r(o,2,i)}catch(t){r(o,2,t)}},o},t}();function s(t){return t instanceof i&&1&t.s}const u="undefined"!=typeof Symbol?Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator")):"@@iterator";function a(t,n,e){if(!t.s){if(e instanceof c){if(!e.s)return void(e.o=a.bind(null,t,n));1&n&&(n=e.s),e=e.v}if(e&&e.then)return void e.then(a.bind(null,t,n),a.bind(null,t,2));t.s=n,t.v=e;var r=t.o;r&&r(t)}}var c=/*#__PURE__*/function(){function t(){}return t.prototype.then=function(n,e){var r=new t,o=this.s;if(o){var i=1&o?n:e;if(i){try{a(r,1,i(this.v))}catch(t){a(r,2,t)}return r}return this}return this.o=function(t){try{var o=t.v;1&t.s?a(r,1,n?n(o):o):e?a(r,1,e(o)):a(r,2,o)}catch(t){a(r,2,t)}},r},t}();function l(t){return t instanceof c&&1&t.s}var f=function(t,n,r,i){try{var s=function(n){return Promise.resolve(function(t,n,r){try{var i=t.thread;return Promise.resolve(t.client.beta.threads.runs.create(i.id,{assistant_id:t.assistant.id,instructions:null!=r?r:""})).then(function(r){return Promise.resolve(o(i,r,t)).then(function(s){var f,h=function(){if("completed"===s.status)return Promise.resolve(e(t,5)).then(function(t){f=t});var h=function(){if("requires_action"===s.status)return Promise.resolve(function(t,n,e,r,i){try{var s=function(){return console.log("Adding output to messages"),Promise.resolve(f.beta.threads.runs.submitToolOutputs(n.id,e.id,{tool_outputs:v})).then(function(t){return Promise.resolve(o(n,t,r))})},f=r.client,h=r.specs.functionList,v=[],d=function(t,n,e){if("function"==typeof t[u]){var r,o,i,s=t[u]();if(function t(e){try{for(;!(r=s.next()).done;)if((e=n(r.value))&&e.then){if(!l(e))return void e.then(t,i||(i=a.bind(null,o=new c,2)));e=e.v}o?a(o,1,e):o=e}catch(t){a(o||(o=new c),2,t)}}(),s.return){var f=function(t){try{r.done||s.return()}catch(t){}return t};if(o&&o.then)return o.then(f,function(t){throw f(t)});f()}return o}if(!("length"in t))throw new TypeError("Object is not iterable");for(var h=[],v=0;v<t.length;v++)h.push(t[v]);return function(t,n,e){var r,o,i=-1;return function e(s){try{for(;++i<t.length;)if((s=n(i))&&s.then){if(!l(s))return void s.then(e,o||(o=a.bind(null,r=new c,2)));s=s.v}r?a(r,1,s):r=s}catch(t){a(r||(r=new c),2,t)}}(),r}(h,function(t){return n(h[t])})}(t.required_action.submit_tool_outputs.tool_calls,function(t){var n=t.function.name;console.log("Requested function: ",n);var e=JSON.parse(t.function.arguments),o=function(o,s){try{var u=Promise.resolve(h[n](e,i,r)).then(function(n){v.push({tool_call_id:t.id,output:JSON.stringify(n)})})}catch(t){return s(t)}return u&&u.then?u.then(void 0,s):u}(0,function(n){v.push({tool_call_id:t.id,output:JSON.stringify(n)})});if(o&&o.then)return o.then(function(){})});return Promise.resolve(d&&d.then?d.then(s):s())}catch(t){return Promise.reject(t)}}(s,i,r,t,n)).then(function(n){return console.log("getting latest message "),Promise.resolve(e(t,5)).then(function(t){f=t})});f=[{runStatus:s.status}]}();return h&&h.then?h.then(function(){}):void 0}();return h&&h.then?h.then(function(){return f}):f})})}catch(t){return Promise.reject(t)}}(t,i,r))},f=t.client,h=t.thread,v=function(t,e){try{var r=Promise.resolve(f.beta.threads.messages.create(h.id,{role:"user",content:n})).then(function(){})}catch(t){return e(t)}return r&&r.then?r.then(void 0,e):r}(0,function(t){throw console.log(t),new Error("Request failed on adding user message to thread.")});return Promise.resolve(v&&v.then?v.then(s):s())}catch(t){return Promise.reject(t)}},h=function(t,n){try{return console.log("in closeAssistant"),Promise.resolve(!0)}catch(t){return Promise.reject(t)}},v=function(t,n){try{return Promise.resolve(t.client.beta.threads.messages.list(t.thread.id,{limit:n})).then(function(t){return t.data.map(function(t){var n=t.content[0];return{id:t.id,role:t.role,type:n.type,content:n[n.type].value}})})}catch(t){return Promise.reject(t)}},d=function(t,n,e){try{var r=e.client,o=e.assistant;return Promise.resolve(r.files.create({file:t,purpose:n})).then(function(t){console.log(".......................",t);var n=[].concat(o.file_ids);n.push(t.id),console.log(n);var i=function(t,i){try{var s=Promise.resolve(r.beta.assistants.update(o.id,{file_ids:n})).then(function(t){e.assistant=t,console.log(".......................",t)})}catch(t){return i(t)}return s&&s.then?s.then(void 0,i):s}(0,function(t){console.log(t)});return i&&i.then?i.then(function(){return n}):n})}catch(t){return Promise.reject(t)}};export{h as closeAssistant,e as getLatestMessage,v as getMessages,f as runAssistant,n as setupAssistant,d as uploadFile};
//# sourceMappingURL=index.module.js.map
