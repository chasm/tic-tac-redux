/* */ 
var _curry2 = require('./internal/_curry2');
var map = require('./map');
module.exports = _curry2(function lens(getter, setter) {
  return function(f) {
    return function(s) {
      return map(function(v) {
        return setter(v, s);
      }, f(getter(s)));
    };
  };
});
