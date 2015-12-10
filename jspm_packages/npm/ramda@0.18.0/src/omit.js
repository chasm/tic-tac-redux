/* */ 
var _contains = require('./internal/_contains');
var _curry2 = require('./internal/_curry2');
module.exports = _curry2(function omit(names, obj) {
  var result = {};
  for (var prop in obj) {
    if (!_contains(prop, names)) {
      result[prop] = obj[prop];
    }
  }
  return result;
});
