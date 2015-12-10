/* */ 
var _curry3 = require('./internal/_curry3');
var _slice = require('./internal/_slice');
var assoc = require('./assoc');
module.exports = _curry3(function assocPath(path, val, obj) {
  switch (path.length) {
    case 0:
      return obj;
    case 1:
      return assoc(path[0], val, obj);
    default:
      return assoc(path[0], assocPath(_slice(path, 1), val, Object(obj[path[0]])), obj);
  }
});
