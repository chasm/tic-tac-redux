/* */ 
var _arity = require('./internal/_arity');
var _curry2 = require('./internal/_curry2');
var _slice = require('./internal/_slice');
var curry = require('./curry');
module.exports = _curry2(function useWith(fn, transformers) {
  return curry(_arity(transformers.length, function() {
    var args = [],
        idx = 0;
    while (idx < transformers.length) {
      args.push(transformers[idx].call(this, arguments[idx]));
      idx += 1;
    }
    return fn.apply(this, args.concat(_slice(arguments, transformers.length)));
  }));
});
