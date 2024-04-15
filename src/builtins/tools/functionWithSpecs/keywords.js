

const _keywordsFunctionSpec = {
  type: 'function',
  function: {
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
    }
  }
}

async function _keywords(params) {
  let { keywords, format } = params;
  console.log('keywords', keywords, format);
  let rx = '';
  switch (format) {
    case 'html': {
      let t = '<ul>';
      keywords.split(',').forEach((k) => {
        t += `<li>${k}</li>`;
      });
      t += '</ul>';
      rx = t;
      break;
    }
    case 'array': {
      let r = keywords.split(',');
      rx = JSON.stringify(r, null,4);
      break;
    }
    case 'object': {
      let r = {};
      keywords.split(',').forEach((k, i) => {
        r[`key${i}`] = k;
      });
      rx = JSON.stringify(r, null,4);
      break;
    }
    default:
      rx =JSON.stringify(params);
  }
  console.log('rx', rx);
  return rx;
}
let catalogSearch = {
  tools:[_keywordsFunctionSpec],
  functionList: {_keywords} 
};
export default catalogSearch;