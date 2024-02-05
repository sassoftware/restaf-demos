import gptFunctions from "./gptFunctions";
function gptFunctionSpecs() {
  let functionSpecs = [
    configFunctionSpec,
    getDataFunctionSpec,
    listSASObjectsFunctionSpec,
    listSASDataLibFunctionSpec,
    listSASTablesFunctionSpec,
    listColumnsFunctionSpec,
    listFunctionsinAppSpec,
  ];
  let messages = functionSpecs.map((item) => {
    return {role: 'user', content: item.description};
  });
  messages.push({role: "system", content: "You are a prompt manager for TableEditor" });
  let functionList = gptFunctions();
  return {functionSpecs, messages, functionList};
}

const configFunctionSpec = {
  name: "getForm",
  description: "create a form for a table like sashelp.cars as a JSON object",
  parameters: {
    properties: {
      table: {
        type: "string",
        description:
          "The table to setup. The form of the table is casuser.cars",
      },
      keys: {
        type: "string",
        description: "The form of the keys is Make,Model,Type",
      },
      columns: {
        type: "string",
        description:
          "Keep  only these columns. The form of the columns is Make,Model,Type",
      },
    },
    type: "object",
    required: ["table"],
  },
};
// 
const getDataFunctionSpec = {
  name: "getData",
  description:
    "Get data for a table like casuser.cars",
  parameters: {
    properties: {
      table: {
        type: "string",
        description:
          "The table to setup. The form of the table is casuser.cars",
      },
      count: {
        type: "integer",
        description:
          "Get this many rows. If not speified, then get 10 rows",
      },
    },
    type: "object",
    required: ["table"],
  },
};
const listSASObjectsFunctionSpec = {
  name: "listSASObjects",
  description:
    "get a list of SAS resource like reports, files, folders. List the specified count of resources. If not specified, then list 10 resources.  ",
  parameters: {
    properties: {
      resource: {
        type: "string",
        description:
          "The objecttable to setup. The form of the table is casuser.cars",
      },
      count: {
        type: "integer",
        description:
          "Get this many rows. If not speified, then get 10 rows",
      },
    },
    type: "object",
    required: ["resource"]
  },
};
const listSASDataLibFunctionSpec = {
  name: "listSASDataLib",
  description:
    "get a list of available data library",
    properties: {},
    type: "object"
  };
const listSASTablesFunctionSpec = {
  name: "listSASTables",
  description:
    "list tables in a SAS library like casuser, sashelp. List the specified count of tables. If not specified, then list 10 tables.",
  parameters: {
    properties: {
      library: {
        type: "string",
        description:
          "A SAS library like casuser, sashelp, samples",
      },
      count: {
        type: "integer",
        description:
          "Get this many rows. If not specified, then get 10 rows",
      },
    },
    type: "object",
    required: ["library"]
  },
};
const listColumnsFunctionSpec = {
  name: "listColumns",
  description:
    "list columns in a table like casuser.cars, sashelp.cars",
  parameters: {
    properties: {
      table: {
        type: "string",
        description:
          "A table like sashelp.cars",
      }
    },
    type: "object",
    required: ["table"]
}
};
const listFunctionsinAppSpec = {
  name: "listFunctions",
  description: "help on prompts designed for Viya",
  parameters: {
    properties: {},
    type: "object"
}
};

export default gptFunctionSpecs;