// Step 1: Import the necessary modules
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import getToken from "./getToken.js";
import { setupAssistant, runAssistant } from "@sassoftware/viya-assistantjs";
let { host, token } = getToken();

//Step 2: Define the custom tools

const tools = [
  {
    type: "function",
    function: {
      name: "listTables",
      description: `for a given library for  either sas or cas source, get the list of available tables.
      (ex: list tables in cas library samples, list tables in sas library sashelp)
      Optionally let user specify the source as cas or compute.`,
      parameters: {
        properties: {
          library: {
            type: "string",
            description: "A SAS library like casuser, sashelp, samples",
          },
          start: {
            type: "integer",
            description: "Start at lookup at this index. Default is 0.",
          },
          limit: {
            type: "integer",
            description:
              "Return only this many tables. If not specified, then return 10 tables.",
          },
          source: {
            type: "string",
            description: "The source of the data. cas or sas",
            enum: ["cas", "compute"],
          },
        },
        type: "object",
        required: ["library"],
      },
    },
  },
];
async function listTables(params, userData, appControl) {
  let { library, source, start, limit } = params;
  // get session information
  let appEnv = await appControl.getViyaSession(source);
  let p = {
    qs: {
      limit: limit == null ? 10 : limit,
      start: start == null ? 0 : start,
    },
  };

  let r = await appEnv.restafedit.getTableList(library, appEnv, p);
  return JSON.stringify(r);
}
// Step 2: setup configuration
let config = {
  devMode: true,
  provider: "openai", // or 'azureai'
  model: process.env.OPENAI_MODEL,
  credentials: {
    key: process.env.OPENAI_KEY, // obtain from provider
  },

  assistantid: null,//create a new assistant
  assistantName: "SAS_ASSISTANT",
  threadid: null,
  vectorStoreid: null,
  domainTools: {
    tools: tools,
    functionList: { listTables },
    instructions: "Assistant to list tables in a library",
  },
  viyaConfig: {
    logonPayload: {
      authType: "server",
      host: host,
      token: token,
      tokenType: "bearer",
    },
  },
  userData: {},
};

// run a chat session
chat(config)
  .then((r) => console.log("done"))
  .catch((err) => console.log(err));

async function chat(config) {
  //Setup assistant
  let appControl = await setupAssistant(config);

  // create readline interface and chat with user
  const rl = readline.createInterface({ input, output });

  // process user input in a loop
  while (true) {
    let prompt = await rl.question(">");
    // exit session
    if (prompt.toLowerCase() === "exit" || prompt.toLowerCase() === "quit") {
      rl.close();
      break;
    }
    // let assistant process the prompt
    let promptInstructions = " ";
    try {
      // run prompt
      let response = await runAssistant(appControl, prompt, promptInstructions);
      console.log(response[0].content);
    } catch (err) {
      console.log(err);
    }
  }
}
