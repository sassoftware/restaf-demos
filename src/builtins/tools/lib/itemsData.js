// extract just the data and ignore links etc...
function itemsData(r) {
 
  
  console.log('itemsData: ', r.itemsList().size);
  let rx = [];
  let details = {};

  if (r.itemsList().size > 0) {
    rx = r.itemsList().toJS().map(item => {
      let rt = r.items(item, 'data').toJS();
      let row = {name: item, label: rt.label, type: rt.type};
      if (rt.attributes != null) {
        row.source = (rt.attributes.sourceSystem) ? rt.attributes.sourceSystem.toLowerCase() : '';
        row.library = rt.attributes.library;
      }
      details[item] = rt;
      return row;
    });
  } else {
    rx = (r.items('data') != null) ? [r.items('data').toJS()] : {warning: 'No data returned'};
    details = rx;
  }
  return {_message: JSON.stringify(rx), _details: details};
}
export default itemsData;
