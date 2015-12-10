/* */ 
var _contains = require('./internal/_contains');
var _curry2 = require('./internal/_curry2');
module.exports = _curry2(function uniqBy(fn, list) {
  var idx = 0,
      applied = [],
      result = [],
      appliedItem,
      item;
  while (idx < list.length) {
    item = list[idx];
    appliedItem = fn(item);
    if (!_contains(appliedItem, applied)) {
      result.push(item);
      applied.push(appliedItem);
    }
    idx += 1;
  }
  return result;
});
