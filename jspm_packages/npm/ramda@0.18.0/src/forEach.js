/* */ 
var _checkForMethod = require('./internal/_checkForMethod');
var _curry2 = require('./internal/_curry2');
module.exports = _curry2(_checkForMethod('forEach', function forEach(fn, list) {
  var len = list.length;
  var idx = 0;
  while (idx < len) {
    fn(list[idx]);
    idx += 1;
  }
  return list;
}));
