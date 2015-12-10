/* */ 
var _curry1 = require('./internal/_curry1');
module.exports = _curry1(function cond(pairs) {
  return function() {
    var idx = 0;
    while (idx < pairs.length) {
      if (pairs[idx][0].apply(this, arguments)) {
        return pairs[idx][1].apply(this, arguments);
      }
      idx += 1;
    }
  };
});
