//Define New Tool and add it to the assistant
import restaflib from '@sassoftware/restaflib';
import fs from 'fs/promises';
function addRunSAS() {
  let tools = [
    {
      type: 'function',
      function: {
        name: "processSASProgram",
        description: "process named SAS program. The program extension must be .sas or .casl",
        parameters: {
          properties: {
            resource: {
              type: "string",
              description: "the name of the program to run",
            },
          },
          type: "object",
          required: ["resource"],
        },
      }
    }
  ];
  // function to run the program
  async function processSASProgram(params, appEnv) {
    let { resource} = params;
    let { store, session } = appEnv;
    let src;
    try {
      src = await fs.readFile(resource, "utf8");
    } catch (err) {
      console.log(err);
      return "Error reading program " + resource;
    }
    try {
      if (appEnv.source === "cas") {
        let r = await restaflib.caslRun(store, session, src, {}, true);
        console.log(JSON.stringify(r.results));
        return JSON.stringify(r.results);
      } else if (appEnv) {
        let computeSummary = await computeRun(store, session, src);
        let log = await restaflib.computeResults(store, computeSummary, "log");
        return logAsArray(log);
      } else {
        return "Cannot run program without a session";
      }
    } catch (err) {
      console.log(err);
      return "Error running program " + program;
    }
  }

  return {
    tools: tools, 
    functionList: {processSASProgram: processSASProgram},
    instructions: 'Additionally use this tool to run the specified .',
    replace: false // use true if you want to get rid of previous tool definition;
  };
}
export default addRunSAS;