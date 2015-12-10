/* */ 
var _curry2 = require('./internal/_curry2');
module.exports = _curry2(function dissoc(prop, obj) {
  var result = {};
  for (var p in obj) {
    if (p !== prop) {
      result[p] = obj[p];
    }
  }
  return result;
});
