/* */ 
var _curry3 = require('./internal/_curry3');
var equals = require('./equals');
var path = require('./path');
module.exports = _curry3(function pathEq(_path, val, obj) {
  return equals(path(_path, obj), val);
});
