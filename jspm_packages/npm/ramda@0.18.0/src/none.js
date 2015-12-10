/* */ 
var _complement = require('./internal/_complement');
var _curry2 = require('./internal/_curry2');
var _dispatchable = require('./internal/_dispatchable');
var _xany = require('./internal/_xany');
var any = require('./any');
module.exports = _curry2(_complement(_dispatchable('any', _xany, any)));
