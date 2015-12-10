/* */ 
var _curry2 = require('./internal/_curry2');
var _slice = require('./internal/_slice');
var assoc = require('./assoc');
var dissoc = require('./dissoc');
module.exports = _curry2(function dissocPath(path, obj) {
  switch (path.length) {
    case 0:
      return obj;
    case 1:
      return dissoc(path[0], obj);
    default:
      var head = path[0];
      var tail = _slice(path, 1);
      return obj[head] == null ? obj : assoc(head, dissocPath(tail, obj[head]), obj);
  }
});
