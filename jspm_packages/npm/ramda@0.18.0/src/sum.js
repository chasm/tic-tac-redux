/* */ 
var add = require('./add');
var reduce = require('./reduce');
module.exports = reduce(add, 0);
