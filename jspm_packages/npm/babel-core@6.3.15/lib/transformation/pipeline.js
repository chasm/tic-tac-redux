/* */ 
"use strict";
var _classCallCheck = require('babel-runtime/helpers/class-call-check')["default"];
var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')["default"];
exports.__esModule = true;
var _helpersNormalizeAst = require('../helpers/normalize-ast');
var _helpersNormalizeAst2 = _interopRequireDefault(_helpersNormalizeAst);
var _file = require('./file/index');
var _file2 = _interopRequireDefault(_file);
var Pipeline = (function() {
  function Pipeline() {
    _classCallCheck(this, Pipeline);
  }
  Pipeline.prototype.lint = function lint(code) {
    var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    opts.code = false;
    opts.mode = "lint";
    return this.transform(code, opts);
  };
  Pipeline.prototype.pretransform = function pretransform(code, opts) {
    var file = new _file2["default"](opts, this);
    return file.wrap(code, function() {
      file.addCode(code);
      file.parseCode(code);
      return file;
    });
  };
  Pipeline.prototype.transform = function transform(code, opts) {
    var file = new _file2["default"](opts, this);
    return file.wrap(code, function() {
      file.addCode(code);
      file.parseCode(code);
      return file.transform();
    });
  };
  Pipeline.prototype.transformFromAst = function transformFromAst(ast, code, opts) {
    ast = _helpersNormalizeAst2["default"](ast);
    var file = new _file2["default"](opts, this);
    return file.wrap(code, function() {
      file.addCode(code);
      file.addAst(ast);
      return file.transform();
    });
  };
  return Pipeline;
})();
exports["default"] = Pipeline;
module.exports = exports["default"];
