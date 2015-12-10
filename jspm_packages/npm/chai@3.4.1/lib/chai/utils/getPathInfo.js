/* */ 
var hasProperty = require('./hasProperty');
module.exports = function getPathInfo(path, obj) {
  var parsed = parsePath(path),
      last = parsed[parsed.length - 1];
  var info = {
    parent: parsed.length > 1 ? _getPathValue(parsed, obj, parsed.length - 1) : obj,
    name: last.p || last.i,
    value: _getPathValue(parsed, obj)
  };
  info.exists = hasProperty(info.name, info.parent);
  return info;
};
function parsePath(path) {
  var str = path.replace(/([^\\])\[/g, '$1.['),
      parts = str.match(/(\\\.|[^.]+?)+/g);
  return parts.map(function(value) {
    var re = /^\[(\d+)\]$/,
        mArr = re.exec(value);
    if (mArr)
      return {i: parseFloat(mArr[1])};
    else
      return {p: value.replace(/\\([.\[\]])/g, '$1')};
  });
}
function _getPathValue(parsed, obj, index) {
  var tmp = obj,
      res;
  index = (index === undefined ? parsed.length : index);
  for (var i = 0,
      l = index; i < l; i++) {
    var part = parsed[i];
    if (tmp) {
      if ('undefined' !== typeof part.p)
        tmp = tmp[part.p];
      else if ('undefined' !== typeof part.i)
        tmp = tmp[part.i];
      if (i == (l - 1))
        res = tmp;
    } else {
      res = undefined;
    }
  }
  return res;
}
