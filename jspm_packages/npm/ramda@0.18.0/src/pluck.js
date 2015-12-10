/* */ 
var _curry2 = require('./internal/_curry2');
var map = require('./map');
var prop = require('./prop');
module.exports = _curry2(function pluck(p, list) {
  return map(prop(p), list);
});
