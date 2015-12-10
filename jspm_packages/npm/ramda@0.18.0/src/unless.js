/* */ 
var _curry3 = require('./internal/_curry3');
module.exports = _curry3(function unless(pred, whenFalseFn, x) {
  return pred(x) ? x : whenFalseFn(x);
});
