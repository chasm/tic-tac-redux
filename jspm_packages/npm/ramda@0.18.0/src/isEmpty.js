/* */ 
var _curry1 = require('./internal/_curry1');
var empty = require('./empty');
var equals = require('./equals');
module.exports = _curry1(function isEmpty(x) {
  return x != null && equals(x, empty(x));
});
