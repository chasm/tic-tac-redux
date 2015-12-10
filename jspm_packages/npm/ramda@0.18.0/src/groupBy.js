/* */ 
var _curry2 = require('./internal/_curry2');
var _dispatchable = require('./internal/_dispatchable');
var _reduce = require('./internal/_reduce');
var _xgroupBy = require('./internal/_xgroupBy');
var append = require('./append');
module.exports = _curry2(_dispatchable('groupBy', _xgroupBy, function groupBy(fn, list) {
  return _reduce(function(acc, elt) {
    var key = fn(elt);
    acc[key] = append(elt, acc[key] || (acc[key] = []));
    return acc;
  }, {}, list);
}));
