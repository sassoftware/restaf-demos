

async function _deval(params) {
  

 const varName = params.name;
return { content: [{ type: 'text', text: process.env[varName]}]};
}

export default _deval;
