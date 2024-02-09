import gptFunctions from "./gptFunctions.js";
function gptFunctionSpecs() {
  let functionSpecs = [
    configFunctionSpec,
    getDataFunctionSpec,
    listSASObjectsFunctionSpec,
    listSASDataLibFunctionSpec,
    listSASTablesFunctionSpec,
    listColumnsFunctionSpec,
   // listFunctionsinAppSpec - created dynamically
    runSASFunctionSpec,
    basicFunctionSpec,
    resumeFunctionSpec,
    describeTableSpec
  ];

  let functionList = gptFunctions(functionSpecs);
  functionSpecs.push(listFunctionsinAppSpec);

  return { functionSpecs, functionList };
}

const listFunctionsinAppSpec = {
  name: "listFunctions",
  description: "Show prompts",
  parameters: {},
  type: "object",
  required: []
};
const configFunctionSpec = {
  name: "getForm",
  description: "Create a form for a table like sashelp.cars as a JSON object",
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
  description: "Fetch data from a  table like casuser.cars. To limit the number of rows, specify the limit parameter",
  parameters: {
    properties: {
      table: {
        type: "string",
        description:
          "The table to setup. The form of the table is casuser.cars",
      },
      limit: {
        type: "integer",
        description: "Fetch only the specified number of rows"
      },
    },
    type: "object",
    required: ["table", "limit"],
  },
};
const listSASObjectsFunctionSpec = {
  name: "listSASObjects",
  description:
    "get a list of SAS resources like reports, files, folders. Specify the limit parameter to limit the number of items returned",
  parameters: {
    properties: {
      resource: {
        type: "string",
        description:
          "The objecttable to setup. The form of the table is casuser.cars",
      },
      limit: {
        type: "integer",
        description: "Get this many items",
      },
    },
    type: "object",
    required: ["resource", "limit"],
  },
};
const listSASDataLibFunctionSpec = {
  name: "listSASDataLib",
  description:
    "get a list of available SAS libs, calibs, librefs. A example would be list libs. If limit is not is specified, then the function will return the first 10 libs",
  parameters: {
    properties: {
      limit: {
        type: "integer",
        description: "Return only this many libs. If not specified, then return 10 libs.",
      },
    },
  type: "object",
  }
};
const listSASTablesFunctionSpec = {
  name: "listSASTables",
  description:
    "for a given library, lib , caslibs get the list available tables(ex: list tables for Samples)",
  parameters: {
    properties: {
      library: {
        type: "string",
        description: "A SAS library like casuser, sashelp, samples",
      },
      limit: {
        type: "integer",
        description:
          "Return only this many tables. If not specified, then return 10 tables.",
      },
    },
    type: "object",
    required: ["library", "limit"], 
  },
};
const listColumnsFunctionSpec = {
  name: "listColumns",
  description: "Get schema or columns for specified table. Table is of the form sashelp.cars",
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
const describeTableSpec = {
  name: "describeTable",
  description: "Describe the table like sashelp. return information on the table like columns, types, keys",
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
  description: "get resume for a person.ex: resume for deva Deva is a developer",
  parameters: {
   
    properties: {
     
      person: {
        type: "string",
        description: "name of person",
      }, 
      resume: {
        type: "string",
        description: "resume for person",
      },

    },
    type: "object",
    required: ["person", "resume"]
  },
};
export default gptFunctionSpecs;
