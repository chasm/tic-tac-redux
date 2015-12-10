/* */ 
var chain = require('./chain');
var compose = require('./compose');
var identity = require('./identity');
var map = require('./map');
var prepend = require('./prepend');
module.exports = function composeK() {
  return compose.apply(this, prepend(identity, map(chain, arguments)));
};
