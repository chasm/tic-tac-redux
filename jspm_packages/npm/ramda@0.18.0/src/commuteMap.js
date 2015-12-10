/* */ 
var _curry3 = require('./internal/_curry3');
var ap = require('./ap');
var map = require('./map');
var prepend = require('./prepend');
var reduceRight = require('./reduceRight');
module.exports = _curry3(function commuteMap(fn, of, list) {
  function consF(acc, x) {
    return ap(map(prepend, fn(x)), acc);
  }
  return reduceRight(consF, of([]), list);
});
