/* */ 
var _arity = require('./internal/_arity');
var _pipe = require('./internal/_pipe');
var reduce = require('./reduce');
var tail = require('./tail');
module.exports = function pipe() {
  if (arguments.length === 0) {
    throw new Error('pipe requires at least one argument');
  }
  return _arity(arguments[0].length, reduce(_pipe, arguments[0], tail(arguments)));
};
