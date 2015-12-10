/* */ 
var _curry2 = require('./internal/_curry2');
var _equals = require('./internal/_equals');
module.exports = _curry2(function equals(a, b) {
  return _equals(a, b, [], []);
});
