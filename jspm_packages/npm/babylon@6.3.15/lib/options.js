/* */ 
(function(process) {
  "use strict";
  exports.__esModule = true;
  exports.getOptions = getOptions;
  var defaultOptions = {
    sourceType: "script",
    allowReturnOutsideFunction: false,
    allowImportExportEverywhere: false,
    allowSuperOutsideMethod: false,
    plugins: [],
    strictMode: null
  };
  exports.defaultOptions = defaultOptions;
  function getOptions(opts) {
    var options = {};
    for (var key in defaultOptions) {
      options[key] = opts && key in opts ? opts[key] : defaultOptions[key];
    }
    return options;
  }
})(require('process'));
