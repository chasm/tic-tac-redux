/* */ 
var _concat = require('./internal/_concat');
var _createPartialApplicator = require('./internal/_createPartialApplicator');
var flip = require('./flip');
module.exports = _createPartialApplicator(flip(_concat));
