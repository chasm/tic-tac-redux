/* */ 
var _checkForMethod = require('./internal/_checkForMethod');
var slice = require('./slice');
module.exports = _checkForMethod('tail', slice(1, Infinity));
