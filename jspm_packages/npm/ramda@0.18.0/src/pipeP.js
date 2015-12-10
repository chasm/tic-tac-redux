/* */ 
var _arity = require('./internal/_arity');
var _pipeP = require('./internal/_pipeP');
var reduce = require('./reduce');
var tail = require('./tail');
module.exports = function pipeP() {
  if (arguments.length === 0) {
    throw new Error('pipeP requires at least one argument');
  }
  return _arity(arguments[0].length, reduce(_pipeP, arguments[0], tail(arguments)));
};
