/* */ 
var _curry2 = require('./internal/_curry2');
var _isString = require('./internal/_isString');
module.exports = _curry2(function nth(offset, list) {
  var idx = offset < 0 ? list.length + offset : offset;
  return _isString(list) ? list.charAt(idx) : list[idx];
});
