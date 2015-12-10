/* */ 
"use strict";
var _inherits = require('babel-runtime/helpers/inherits')["default"];
var _classCallCheck = require('babel-runtime/helpers/class-call-check')["default"];
var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')["default"];
var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')["default"];
exports.__esModule = true;
var _detectIndent = require('detect-indent');
var _detectIndent2 = _interopRequireDefault(_detectIndent);
var _whitespace = require('./whitespace');
var _whitespace2 = _interopRequireDefault(_whitespace);
var _sourceMap = require('./source-map');
var _sourceMap2 = _interopRequireDefault(_sourceMap);
var _position = require('./position');
var _position2 = _interopRequireDefault(_position);
var _babelMessages = require('babel-messages');
var messages = _interopRequireWildcard(_babelMessages);
var _printer = require('./printer');
var _printer2 = _interopRequireDefault(_printer);
var CodeGenerator = (function(_Printer) {
  _inherits(CodeGenerator, _Printer);
  function CodeGenerator(ast, opts, code) {
    _classCallCheck(this, CodeGenerator);
    opts = opts || {};
    var comments = ast.comments || [];
    var tokens = ast.tokens || [];
    var format = CodeGenerator.normalizeOptions(code, opts, tokens);
    var position = new _position2["default"]();
    _Printer.call(this, position, format);
    this.comments = comments;
    this.position = position;
    this.tokens = tokens;
    this.format = format;
    this.opts = opts;
    this.ast = ast;
    this.whitespace = new _whitespace2["default"](tokens);
    this.map = new _sourceMap2["default"](position, opts, code);
  }
  CodeGenerator.normalizeOptions = function normalizeOptions(code, opts, tokens) {
    var style = "  ";
    if (code) {
      var _indent = _detectIndent2["default"](code).indent;
      if (_indent && _indent !== " ")
        style = _indent;
    }
    var format = {
      auxiliaryCommentBefore: opts.auxiliaryCommentBefore,
      auxiliaryCommentAfter: opts.auxiliaryCommentAfter,
      shouldPrintComment: opts.shouldPrintComment,
      retainLines: opts.retainLines,
      comments: opts.comments == null || opts.comments,
      compact: opts.compact,
      concise: opts.concise,
      quotes: CodeGenerator.findCommonStringDelimiter(code, tokens),
      indent: {
        adjustMultilineComment: true,
        style: style,
        base: 0
      }
    };
    if (format.compact === "auto") {
      format.compact = code.length > 100000;
      if (format.compact) {
        console.error("[BABEL] " + messages.get("codeGeneratorDeopt", opts.filename, "100KB"));
      }
    }
    if (format.compact) {
      format.indent.adjustMultilineComment = false;
    }
    return format;
  };
  CodeGenerator.findCommonStringDelimiter = function findCommonStringDelimiter(code, tokens) {
    var occurences = {
      single: 0,
      double: 0
    };
    var checked = 0;
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (token.type.label !== "string")
        continue;
      var raw = code.slice(token.start, token.end);
      if (raw[0] === "'") {
        occurences.single++;
      } else {
        occurences.double++;
      }
      checked++;
      if (checked >= 3)
        break;
    }
    if (occurences.single > occurences.double) {
      return "single";
    } else {
      return "double";
    }
  };
  CodeGenerator.prototype.generate = function generate() {
    this.print(this.ast);
    this.printAuxAfterComment();
    return {
      map: this.map.get(),
      code: this.get()
    };
  };
  return CodeGenerator;
})(_printer2["default"]);
exports.CodeGenerator = CodeGenerator;
exports["default"] = function(ast, opts, code) {
  var gen = new CodeGenerator(ast, opts, code);
  return gen.generate();
};
