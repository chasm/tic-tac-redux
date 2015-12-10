/* */ 
var _curry1 = require('./internal/_curry1');
var nth = require('./nth');
module.exports = _curry1(function nthArg(n) {
  return function() {
    return nth(n, arguments);
  };
});
