

async function _deval(_appContext, params) {
  debugger;
  console.error(params);
  console.error(_appContext);

 const varName = params.name;
return { content: [{ type: 'text', text: process.env[varName]}]};
}

export default _deval;
