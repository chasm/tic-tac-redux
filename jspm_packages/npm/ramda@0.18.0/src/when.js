/* */ 
var _curry3 = require('./internal/_curry3');
module.exports = _curry3(function when(pred, whenTrueFn, x) {
  return pred(x) ? whenTrueFn(x) : x;
});
