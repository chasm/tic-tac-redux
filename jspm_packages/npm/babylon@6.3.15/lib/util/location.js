/* */ 
"use strict";
var _classCallCheck = require('babel-runtime/helpers/class-call-check')["default"];
exports.__esModule = true;
exports.getLineInfo = getLineInfo;
var _whitespace = require('./whitespace');
var Position = function Position(line, col) {
  _classCallCheck(this, Position);
  this.line = line;
  this.column = col;
};
exports.Position = Position;
var SourceLocation = function SourceLocation(start, end) {
  _classCallCheck(this, SourceLocation);
  this.start = start;
  this.end = end;
};
;
exports.SourceLocation = SourceLocation;
function getLineInfo(input, offset) {
  for (var line = 1,
      cur = 0; ; ) {
    _whitespace.lineBreakG.lastIndex = cur;
    var match = _whitespace.lineBreakG.exec(input);
    if (match && match.index < offset) {
      ++line;
      cur = match.index + match[0].length;
    } else {
      return new Position(line, offset - cur);
    }
  }
}
