import logAsArray  from "../lib/logAsArray.js";
let tools = [
  {
    type: "function",
    function: {
      name: "_createODSReport",
      description: "create an ods report on  the selected sas table",
      parameters: {
        properties: {
          table: {
            type: "string",
            description: "table specified as libref.name",
          },
          where: {
            type: "string",
            description: "where clause",
          },
  
        },
        type: "object",
        required: ["program"],
      },
    },
  },
];

//handler running the proc print
async function _createODSReport(params, userData, appControl) {
  let { table, where} = params;

  // get compute session
  let appEnv = await appControl.getViyaSession('sas');

  
  // create macros
  let name = table.split('.')[1];
  
  console.log(name);
  // create src

  let whereClause = (where != null) ? 'where ' + where : '';
  let macro = {table: table,name: name, where: whereClause};
  let src = `ods html style=htmlblue; title Data on &name; proc print data=&table;&where; ods html close; run;`;


  // adjust based on extension
  console.log(src);
  try {
    let {store, session, restaflib} = appEnv;
    // run the program
    let computeSummary = await restaflib.computeRun(store, session, src, macro);

    // get results
    let log = await restaflib.computeResults(store, computeSummary, 'log');
    console.log(log)
    let ods = await restaflib.computeResults(store, computeSummary, 'ods');
    let file = await appControl.uploadFile(`${name}.html`,ods,'text/html', 'assistants');
    console.log(file);
    userData.fileid.push(file.fileid);
   
    return JSON.stringify(JSON.stringify(logAsArray(log)));

  } catch (err) {
    console.log(err);
    return "Error running program " + program;
  }
}
let printSASTable = {
  tools: tools,
  functionList: { _createODSReport: _createODSReport},
};
export default printSASTable;