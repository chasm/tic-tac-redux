/* */ 
var _curry2 = require('./internal/_curry2');
module.exports = _curry2(function objOf(key, val) {
  var obj = {};
  obj[key] = val;
  return obj;
});
