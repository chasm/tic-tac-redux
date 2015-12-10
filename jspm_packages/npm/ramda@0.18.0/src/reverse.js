/* */ 
var _curry1 = require('./internal/_curry1');
var _isString = require('./internal/_isString');
var _slice = require('./internal/_slice');
module.exports = _curry1(function reverse(list) {
  return _isString(list) ? list.split('').reverse().join('') : _slice(list).reverse();
});
