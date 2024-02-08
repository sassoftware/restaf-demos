import gptFunctions from "./gptFunctions.js";
function gptFunctionSpecs() {
  let functionSpecs = [
    configFunctionSpec,
    getDataFunctionSpec,
    listSASObjectsFunctionSpec,
    listSASDataLibFunctionSpec,
    listSASTablesFunctionSpec,
    listColumnsFunctionSpec,
    listFunctionsinAppSpec,
    runSASFunctionSpec,
    basicFunctionSpec,
    resumeFunctionSpec
  ];

  let functionList = gptFunctions();
  return { functionSpecs, functionList };
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
  description: "Get data for a table like casuser.cars",
  parameters: {
    properties: {
      table: {
        type: "string",
        description:
          "The table to setup. The form of the table is casuser.cars",
      },
      count: {
        type: "integer",
        description: "Get this many rows. If not speified, then get 10 rows",
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
        description: "Get this many rows. If not speified, then get 10 rows",
      },
    },
    type: "object",
    required: ["resource"],
  },
};
const listSASDataLibFunctionSpec = {
  name: "listSASDataLib",
  description:
    "get a list of available SAS libs, calibs, librefs. A example would be list libs. If count is not is specified, then the function will return the first 10 libs",
  properties: {},
  type: "object",
};
const listSASTablesFunctionSpec = {
  name: "listSASTables",
  description:
    "for a given library, lib , caslibs get the list available tables(ex: list tables for Samples. If count is not is specified, then the function will return the first 10 libs",
  parameters: {
    properties: {
      library: {
        type: "string",
        description: "A SAS library like casuser, sashelp, samples",
      },
      count: {
        type: "integer",
        description:
          "Return only this many tables. If not specified, then return 10 tables.",
      },
    },
    type: "object",
    required: ["library"],
  },
};
const listColumnsFunctionSpec = {
  name: "listColumns",
  description: "get schema or columns for specified table. Table is of the form sashelp.cars",
  parameters: {
    properties: {
      table: {
        type: "string",
        description: "A table like sashelp.cars",
      },
    },
    type: "object",
    required: ["table"],
  },
};
const runSASFunctionSpec = {
  name: "runSAS",
  description:
    "run the specified file. The file is a path to the sas program",
  parameters: {
    properties: {
      file: {
        type: "string",
        description: "this is the file to run",
      },
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
    type: "object",
  },
};

const basicFunctionSpec = {
  name: "basic",
  description: "format a comma-separated keywords like a,b,c into html, array, object",
  parameters: {
   
    properties: {
      keywords: {
        type: "string",
        description: "A comma-separated list of keywords like a,b,c",
      },
      format: {
        type: "string",
        enum: ["html", "array", "object"],
        description: "Format the string"
      },
    },
    type: "object",
    required: ["keywords", "format"]
  },
};
const resumeFunctionSpec = {
  name: "resume",
  description: "get resume for a person.ex: resume for deva",
  parameters: {
   
    properties: {
      person: {
        type: "string",
        description: "name of person",
      },

    },
    type: "object",
    required: ["person"]
  },
};
export default gptFunctionSpecs;
