/* */ 
var AssertionError = require('assertion-error');
var flag = require('./flag');
var type = require('type-detect');
module.exports = function(obj, types) {
  var obj = flag(obj, 'object');
  types = types.map(function(t) {
    return t.toLowerCase();
  });
  types.sort();
  var str = types.map(function(t, index) {
    var art = ~['a', 'e', 'i', 'o', 'u'].indexOf(t.charAt(0)) ? 'an' : 'a';
    var or = types.length > 1 && index === types.length - 1 ? 'or ' : '';
    return or + art + ' ' + t;
  }).join(', ');
  if (!types.some(function(expected) {
    return type(obj) === expected;
  })) {
    throw new AssertionError('object tested must be ' + str + ', but ' + type(obj) + ' given');
  }
};
