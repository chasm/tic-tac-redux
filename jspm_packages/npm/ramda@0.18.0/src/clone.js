/* */ 
var _clone = require('./internal/_clone');
var _curry1 = require('./internal/_curry1');
module.exports = _curry1(function clone(value) {
  return value != null && typeof value.clone === 'function' ? value.clone() : _clone(value, [], []);
});
