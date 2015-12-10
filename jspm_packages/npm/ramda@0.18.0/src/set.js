/* */ 
var _curry3 = require('./internal/_curry3');
var always = require('./always');
var over = require('./over');
module.exports = _curry3(function set(lens, v, x) {
  return over(lens, always(v), x);
});
