/* */ 
var _curry1 = require('./internal/_curry1');
var _isArguments = require('./internal/_isArguments');
var _isArray = require('./internal/_isArray');
var _isObject = require('./internal/_isObject');
var _isString = require('./internal/_isString');
module.exports = _curry1(function empty(x) {
  return ((x != null && typeof x.empty === 'function') ? x.empty() : (x != null && x.constructor != null && typeof x.constructor.empty === 'function') ? x.constructor.empty() : _isArray(x) ? [] : _isString(x) ? '' : _isObject(x) ? {} : _isArguments(x) ? (function() {
    return arguments;
  }()) : void 0);
});
