/* */ 
var _curry2 = require('./internal/_curry2');
var drop = require('./drop');
module.exports = _curry2(function takeLast(n, xs) {
  return drop(n >= 0 ? xs.length - n : 0, xs);
});
