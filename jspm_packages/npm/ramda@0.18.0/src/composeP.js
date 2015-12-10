/* */ 
var pipeP = require('./pipeP');
var reverse = require('./reverse');
module.exports = function composeP() {
  if (arguments.length === 0) {
    throw new Error('composeP requires at least one argument');
  }
  return pipeP.apply(this, reverse(arguments));
};
