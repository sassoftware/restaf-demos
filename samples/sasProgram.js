// Step 1: Import the necessary modules
import * as readline from "node:readline/promises";
import fss from "fs/promises";
import { stdin as input, stdout as output } from "node:process";
import getToken from "./getToken.js";
import { setupAssistant, runAssistant } from "@sassoftware/viya-assistantjs";

// get the viya host and token from the token file
let { host, token } = getToken();

//Step 2: Define the custom tools
let tools = [
  {
    type: "function",
    function: {
      name: "runSASLocalProgram",
      description: "run the specified program in SAS Viya",
      parameters: {
        properties: {
          program: {
            type: "string",
            description: "the name of the program to run",
          },
          source: {
            type: "string",
            description:
              "The source to run the code in. cas, sas. compute is an alias for sas",
            enum: ["cas", "sas", "compute"],
          },
          output: {
            type: "string",
            description: "The type of output to return",
            enum: ["listing", "log", "ods"]
          }
        },
        type: "object",
        required: ["program"],
      },
    },
  },
];

//handler running sas code from a local file
async function runSASLocalProgram(params, userData, gptControl) {
  let { program, output, source } = params;

  if (source == null) {
    source = program.endsWith(".sas")
      ? "sas"
      : program.endsWith(".casl")
      ? "cas"
      : source;
  }
  if (output == null) {
    output = "log";
  }
  let appEnv = await gptControl.getViyaSession(gptControl, source);
  let src;
  try {
    src = await fss.readFile(program, "utf8");
  } catch (err) {
    console.log(err);
    return "Error reading program " + file;
  }


  try {
    let {store, session, restaflib} = appEnv;

    if (appEnv.source === "cas") {
      let r = await restaflib.caslRun(store, session, src, {}, true);
      console.log(r);
      return JSON.stringify(r.results);
    } else {
      let computeSummary = await restaflib.computeRun(store, session, src);
      // valid values listing, log, ods
      let result = await restaflib.computeResults(store, computeSummary, output);
  
      if (output === "log" || output === "listing") {
        result = JSON.stringify(result);
      } else {
        // Note: gpt will probably not  display ods output in line mode
        //so this kludge - in a web app just return the ods string
        result = JSON.stringify({ods: result});
      }
    
      return result;
    }
  } catch (err) {
    console.log(err);
    return "Error running program " + program;
  }
}

// Step 2: setup configuration
let config = {
  devMode: true,
  provider: "openai", // or 'azureai'
  model: process.env.OPENAI_MODEL,
  credentials: {
    key: process.env.OPENAI_KEY, // obtain from provider
  },
  assistantid: null, //create a new assistant
  assistantName: "SAS_ASSISTANT",
  vectorStoreid: null,
  threadid: null,
  domainTools: {
    tools: tools,
    functionList: { runSASLocalProgram },
    instructions: "This tool will process the specified program in SAS Viya",
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
  let gptControl = await setupAssistant(config);

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
      let response = await runAssistant(gptControl, prompt, promptInstructions);
      console.log(response[0].content);
    } catch (err) {
      console.log(err);
    }
  }
}
