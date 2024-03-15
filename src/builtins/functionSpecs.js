/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import functions from './functions.js';
import instructions from './instructions.js';
/**
 * @description Function specs for the assistant
 * @private
 * @function functionSpecs
 * @returns {object} - object containing specs, tools, functionList
 * 
 */

function functionSpecs(provider, code, retrieval) {
  let specs = [
    _listSASObjectsFunctionSpec,
    _listSASDataLibFunctionSpec,
    _listSASTablesFunctionSpec,
    _listColumnsFunctionSpec,
    _describeTableSpec,
    _getDataFunctionSpec,
   // _runSASFunctionSpec,
    _keywordsFunctionSpec,
   // _contextDataFunctionSpec,
  ];


  // Create tools array  for use with Assistant API
  let tools = [];
  if (code) {
    tools.push({ type: 'code_interpreter' });
  }
  if (retrieval) {
    tools.push({ type: 'retrieval' });
  }

  specs.forEach((f) => {
    let r = {
      type: "function",
      function: Object.assign({}, f),
    };
    tools.push(r);
  });

  let functionList = functions();

  return { specs: specs, tools: tools, functionList: functionList, instructions: instructions() };
}

const _getDataFunctionSpec = {
  name: '_getData',
  description: `Fetch data from a  table like casuser.cars.
                To limit the number of rows, specify the limit parameter.
                If format is true, then the data will be formatted.
                Use standard where clause to filter the data.
                To return data in csv format, specify csv = true. Default is false.`,
  parameters: {
    properties: {
      table: {
        type: 'string',
        description:
          'The table to setup. The form of the table is casuser.cars',
      },
      limit: {
        type: 'integer',
        description: 'Fetch only the specified number of rows'
      },
      'format': {
        type: 'boolean',
        description: 'Format the string - true or false'
      },  
      where: {
        type: 'string',
        description: 'A where clause like Make eq "Audi"'
      },
      csv: {
        type: 'boolean',
        description: 'Return data in csv format - true or false'
      }
    },
    type: 'object',
    required: ['table'],
  },
};
const _listSASObjectsFunctionSpec = {
  name: '_listSASObjects',
  description:
    'list SAS resources like reports, files, folders. Specify the limit parameter to limit the number of items returned',
  parameters: {
    properties: {
      resource: {
        type: 'string',
        description:
          'The objecttable to setup. The form of the table is casuser.cars',
      },
      limit: {
        type: 'integer',
        description: 'Get this many items',
      },
    },
    type: 'object',
    required: ['resource', 'limit'],
  },
};
const _listSASDataLibFunctionSpec = {
  name: '_listSASDataLib',
  description:
    `list available SAS libs, calibs, librefs.
     A example would be list libs. 
     If limit is not is specified, then the function 
     will return the first 10 libs.
     Optionally allow user to specify the source as cas or compute.`,
  parameters: {
    properties: {
      limit: {
        type: 'integer',
        description: 'Return only this many libs. If not specified, then return 10 libs.',
      },
      source: {
        type: 'string',
        description: 'The source of the data. cas or compute',
        enum: ['cas', 'compute'],
      }
    },
  type: 'object',
  }
};
const _listSASTablesFunctionSpec = {
  name: '_listSASTables',
  description:
    `for a given library, lib or caslibs get the list of available tables
    (ex: list tables for Samples)
    Optionally let user specify the source as cas or compute.`,
  parameters: {
    properties: {
      library: {
        type: 'string',
        description: 'A SAS library like casuser, sashelp, samples',
      },
      limit: {
        type: 'integer',
        description:
          'Return only this many tables. If not specified, then return 10 tables.',
      },
      source: {
        type: 'string',
        description: 'The source of the data. cas or compute',
        enum: ['cas', 'compute'],
      }
    },
    type: 'object',
    required: ['library'], 
  },
};
const _listColumnsFunctionSpec = {
  name: '_listColumns',
  description: 'Get schema or columns for specified table. Table is of the form sashelp.cars',
  parameters: {
    properties: {
      table: {
        type: 'string',
        description: 'A table like sashelp.cars',
      },
    },
    type: 'object',
    required: ['table'],
  },
};
const _describeTableSpec = {
  name: '_describeTable',
  description: 'Describe the table like sashelp.cars . return information on the table like columns, types, keys. Optionally format the data',
  parameters: {
    properties: {
      table: {
        type: 'string',
        description: 'A table like sashelp.cars',
      },
      format: {
        type: 'boolean',
        description: 'If true then format the data'
      },
    },
    type: 'object',
    required: ['table'],
  },
};
const _runSASFunctionSpec = {
  name: '_runSAS',
  description:
    'run the specified sas program',
  parameters: {
    properties: {
      file: {
        type: 'string',
        description: 'this is the file to run',
      },
    },
    type: 'object',
    required: ['program']
  },
};

const _keywordsFunctionSpec = {
  name: '_keywords',
  description: 'format a comma-separated keywords like a,b,c into html, array, object',
  parameters: {
   
    properties: {
      keywords: {
        type: 'string',
        description: 'A comma-separated list of keywords like a,b,c',
      },
      format: {
        type: 'string',
        enum: ['html', 'array', 'object'],
        description: 'Format the string'
      },
    },
    type: 'object',
    required: ['keywords', 'format']
  },
}

export default functionSpecs;

/*
const _contextDataFunctionSpec = {
  name: '_contextData',
  description:
    `This is quick way to add some asset to current contect
     User issues a prompt like context <some string>
     the string is usually some string.
     `,
  parameters: {
    properties: {
      asset: {
        type: 'string',
        description: 'the asset to add to the context',
      },
    },
    type: 'object',
    required: ['file'],
  },
};
*/