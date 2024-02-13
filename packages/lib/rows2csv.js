
function rows2csv(arr) {
  // Check if there's data
  if (arr.length === 0) {
    return '';
  }

  // Extract headers
  let headers = Object.keys(arr[0]).join(',') + '\n';
  let rows ='';
  arr.map(obj => {
    let line ='';
    let sep = '';
    Object.values(obj).map(value => {
      line = line + sep + value2String(value);
      sep = ',';
    });
    rows = rows + line + '\n';
  })
  return headers + rows;
}
function value2String (value) {
  let valueString;
  if (value == '.' || value == null) {
    valueString = '';
  } else if (typeof value === 'string') {
    value = value.replace(/"/g, '""');
    valueString = value.trim()
  } else {
    valueString = value.toString();
  }
  return valueString;
}
export default rows2csv;

