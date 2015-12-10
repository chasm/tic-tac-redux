/* */ 
var _concat = require('./internal/_concat');
var _curry2 = require('./internal/_curry2');
module.exports = _curry2(function prepend(el, list) {
  return _concat([el], list);
});
