/* */ 
var _curry3 = require('./internal/_curry3');
var equals = require('./equals');
var propSatisfies = require('./propSatisfies');
module.exports = _curry3(function propEq(name, val, obj) {
  return propSatisfies(equals(val), name, obj);
});
