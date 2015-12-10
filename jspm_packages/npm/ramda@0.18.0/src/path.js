/* */ 
var _curry2 = require('./internal/_curry2');
module.exports = _curry2(function path(paths, obj) {
  if (obj == null) {
    return;
  } else {
    var val = obj;
    var idx = 0;
    while (val != null && idx < paths.length) {
      val = val[paths[idx]];
      idx += 1;
    }
    return val;
  }
});
