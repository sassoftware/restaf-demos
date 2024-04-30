// extract just the data and ignore links etc...
function itemsData(r) {
  let rx = [];
  let details = {};
  let text = '';
  if (r.itemsList().size > 0) {
    rx = r.itemsList().toJS().map(item => {
      let rt = r.items(item, 'data').toJS();
      let row = {name: item, label: rt.label, type: rt.type};
      if (rt.attributes != null) {
        row.source = (rt.attributes.sourceSystem) ? rt.attributes.sourceSystem.toLowerCase() : '';
        row.library = rt.attributes.library;
      }
      details[item] = rt;
      text = text + '\n' + `${item} has the information: ${JSON.stringify(rt)}`;
      return row;
    });
  } else {
    rx = (r.items('data') != null) ? [r.items('data').toJS()] : {warning: 'No data returned'};
    details = rx;
    text = JSON.stringify(rx);
  }
  return {_message: JSON.stringify(rx), _details: details, _text: text};
}
export default itemsData;
