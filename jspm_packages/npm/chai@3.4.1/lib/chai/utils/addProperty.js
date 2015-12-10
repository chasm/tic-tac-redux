/* */ 
var config = require('../config');
var flag = require('./flag');
module.exports = function(ctx, name, getter) {
  Object.defineProperty(ctx, name, {
    get: function addProperty() {
      var old_ssfi = flag(this, 'ssfi');
      if (old_ssfi && config.includeStack === false)
        flag(this, 'ssfi', addProperty);
      var result = getter.call(this);
      return result === undefined ? this : result;
    },
    configurable: true
  });
};
