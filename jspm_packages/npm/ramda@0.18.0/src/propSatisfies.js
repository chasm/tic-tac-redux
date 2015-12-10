/* */ 
var _curry3 = require('./internal/_curry3');
module.exports = _curry3(function propSatisfies(pred, name, obj) {
  return pred(obj[name]);
});
