/* */ 
var _curry3 = require('./internal/_curry3');
module.exports = (function() {
  var Identity = function(x) {
    return {
      value: x,
      map: function(f) {
        return Identity(f(x));
      }
    };
  };
  return _curry3(function over(lens, f, x) {
    return lens(function(y) {
      return Identity(f(y));
    })(x).value;
  });
}());
