/* */ 
var _curry3 = require('./internal/_curry3');
var equals = require('./equals');
module.exports = _curry3(function eqBy(f, x, y) {
  return equals(f(x), f(y));
});
