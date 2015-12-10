/* */ 
var _curry2 = require('./internal/_curry2');
var keys = require('./keys');
module.exports = _curry2(function merge(a, b) {
  var result = {};
  var ks = keys(a);
  var idx = 0;
  while (idx < ks.length) {
    result[ks[idx]] = a[ks[idx]];
    idx += 1;
  }
  ks = keys(b);
  idx = 0;
  while (idx < ks.length) {
    result[ks[idx]] = b[ks[idx]];
    idx += 1;
  }
  return result;
});
