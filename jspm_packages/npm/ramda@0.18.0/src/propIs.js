/* */ 
var _curry3 = require('./internal/_curry3');
var is = require('./is');
var propSatisfies = require('./propSatisfies');
module.exports = _curry3(function propIs(type, name, obj) {
  return propSatisfies(is(type), name, obj);
});
