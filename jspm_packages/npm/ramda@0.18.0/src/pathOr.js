/* */ 
var _curry3 = require('./internal/_curry3');
var defaultTo = require('./defaultTo');
var path = require('./path');
module.exports = _curry3(function pathOr(d, p, obj) {
  return defaultTo(d, path(p, obj));
});
