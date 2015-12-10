/* */ 
var getPathInfo = require('./getPathInfo');
module.exports = function(path, obj) {
  var info = getPathInfo(path, obj);
  return info.value;
};
