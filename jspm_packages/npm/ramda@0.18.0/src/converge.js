/* */ 
var _curry2 = require('./internal/_curry2');
var _map = require('./internal/_map');
var curryN = require('./curryN');
var pluck = require('./pluck');
module.exports = _curry2(function converge(after, fns) {
  return curryN(Math.max.apply(Math, pluck('length', fns)), function() {
    var args = arguments;
    var context = this;
    return after.apply(context, _map(function(fn) {
      return fn.apply(context, args);
    }, fns));
  });
});
