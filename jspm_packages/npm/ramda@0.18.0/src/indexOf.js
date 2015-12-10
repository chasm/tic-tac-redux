/* */ 
var _curry2 = require('./internal/_curry2');
var _indexOf = require('./internal/_indexOf');
var _isArray = require('./internal/_isArray');
module.exports = _curry2(function indexOf(target, xs) {
  return typeof xs.indexOf === 'function' && !_isArray(xs) ? xs.indexOf(target) : _indexOf(xs, target, 0);
});
