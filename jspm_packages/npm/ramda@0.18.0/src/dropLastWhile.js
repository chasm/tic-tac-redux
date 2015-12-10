/* */ 
var _curry2 = require('./internal/_curry2');
var _slice = require('./internal/_slice');
module.exports = _curry2(function dropLastWhile(pred, list) {
  var idx = list.length - 1;
  while (idx >= 0 && pred(list[idx])) {
    idx -= 1;
  }
  return _slice(list, 0, idx + 1);
});
