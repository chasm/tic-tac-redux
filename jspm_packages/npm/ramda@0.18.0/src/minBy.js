/* */ 
var _curry3 = require('./internal/_curry3');
module.exports = _curry3(function minBy(f, a, b) {
  return f(b) < f(a) ? b : a;
});
