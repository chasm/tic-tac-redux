/* */ 
var _curry2 = require('./internal/_curry2');
var _slice = require('./internal/_slice');
module.exports = _curry2(function takeLastWhile(fn, list) {
  var idx = list.length - 1;
  while (idx >= 0 && fn(list[idx])) {
    idx -= 1;
  }
  return _slice(list, idx + 1, Infinity);
});
