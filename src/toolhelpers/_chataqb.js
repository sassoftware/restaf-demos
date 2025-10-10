
async function _chatgpt(params) {
  console.error(params);
  let jsonoutput= [
    { "year": 2020, "number_of_students": 150, "percentage": "30.00%" },
  ]
  return { content: [{ type: 'text', text: JSON.stringify(jsonoutput) }] };

}