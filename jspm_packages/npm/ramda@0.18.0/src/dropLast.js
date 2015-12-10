/* */ 
var _curry2 = require('./internal/_curry2');
var take = require('./take');
module.exports = _curry2(function dropLast(n, xs) {
  return take(n < xs.length ? xs.length - n : 0, xs);
});
