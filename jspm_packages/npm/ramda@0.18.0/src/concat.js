/* */ 
var flip = require('./flip');
var invoker = require('./invoker');
module.exports = flip(invoker(1, 'concat'));
