/* */ 
var _curry1 = require('./internal/_curry1');
var _indexOf = require('./internal/_indexOf');
module.exports = _curry1(function allUniq(list) {
  var len = list.length;
  var idx = 0;
  while (idx < len) {
    if (_indexOf(list, list[idx], idx + 1) >= 0) {
      return false;
    }
    idx += 1;
  }
  return true;
});
