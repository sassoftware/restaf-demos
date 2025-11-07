

async function _deval(params) {
  debugger;

 const varName = params.name;
return { content: [{ type: 'text', text: process.env[varName]}]};
}

export default _deval;
