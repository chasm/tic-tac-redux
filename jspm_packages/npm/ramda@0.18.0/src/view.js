/* */ 
var _curry2 = require('./internal/_curry2');
module.exports = (function() {
  var Const = function(x) {
    return {
      value: x,
      map: function() {
        return this;
      }
    };
  };
  return _curry2(function view(lens, x) {
    return lens(Const)(x).value;
  });
}());
