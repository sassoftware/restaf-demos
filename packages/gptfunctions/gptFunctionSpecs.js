import gptFunctions from './gptFunctions.js';
function gptFunctionSpecs() {
  let functionSpecs = [
    configFunctionSpec,
    getDataFunctionSpec,
    listSASObjectsFunctionSpec,
    listSASDataLibFunctionSpec,
    listSASTablesFunctionSpec,
    listColumnsFunctionSpec,
    listFunctionsinAppSpec,
    runSASFunctionSpec
  ];

  let functionList = gptFunctions();
  return {functionSpecs,functionList};
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
    "get a list of SAS resources like reports, files, folders. An example would be list reports. List the specified count of resources. If not specified, then list 10 resources.  ",
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
    "for a given library get the available tables(ex: library Samples ). List the specified count of tables. If not specified, then list 10 tables.",
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
    "for a given table of the form a.b get the list columns in a table. Example is columns in like casuser.cars",
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
const runSASFunctionSpec = {
  name: "runSAS",
  description: "run the code or file. code is specified as code='abc'. file is the path to the file to run",
  parameters: {
    properties: {
      file: {
        type: "string",
        description: "this is the file to run",
      }
    },
    type: "object",
    required: ["file"],
  },
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