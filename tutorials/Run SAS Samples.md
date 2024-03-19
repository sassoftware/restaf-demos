# Running SAS from a tool

## Sample for running on nodejs

```javascript
import fs from 'fs/promises';
let tools = [
    {
      type: 'function',
      function: {
        name: "_runSAS",
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
  async function _runSAS(params, appEnv) {
    let { resource} = params;
    let { store, session, restaflib} = appEnv;
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
      } else if (appEnv.source === "compute") {
        let computeSummary = await restaflib.computeRun(store, session, src);
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

```