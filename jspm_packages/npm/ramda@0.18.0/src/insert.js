/* */ 
var _curry3 = require('./internal/_curry3');
var _slice = require('./internal/_slice');
module.exports = _curry3(function insert(idx, elt, list) {
  idx = idx < list.length && idx >= 0 ? idx : list.length;
  var result = _slice(list);
  result.splice(idx, 0, elt);
  return result;
});
