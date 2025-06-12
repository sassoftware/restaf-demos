/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// catalog returns a lot of stuff, so we need to filter it down to just the items
function _itemsData(r) {
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
      text = text + '\n' + `${item}: ${JSON.stringify(rt)}`;
      return row;
    });
  } else {
    rx = (r.items('data') != null) ? [r.items('data').toJS()] : {warning: 'No data returned'};
  }
  return rx;
}
export default _itemsData;
