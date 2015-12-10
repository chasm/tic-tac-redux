/* */ 
var _curry2 = require('./internal/_curry2');
module.exports = _curry2(function match(rx, str) {
  return str.match(rx) || [];
});
