

async function _deval(_appContext, params) {
  debugger;
  console.log(params);
  console.log(_appContext);

 const varName = params.name;
return { content: [{ type: 'text', text: process.env[varName]}]};
}

export default _deval;
