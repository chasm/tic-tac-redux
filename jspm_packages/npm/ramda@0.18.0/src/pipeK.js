/* */ 
var composeK = require('./composeK');
var reverse = require('./reverse');
module.exports = function pipeK() {
  return composeK.apply(this, reverse(arguments));
};
