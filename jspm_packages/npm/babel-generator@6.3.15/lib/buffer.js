/* */ 
(function(Buffer) {
  "use strict";
  var _classCallCheck = require('babel-runtime/helpers/class-call-check')["default"];
  var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')["default"];
  exports.__esModule = true;
  var _repeating = require('repeating');
  var _repeating2 = _interopRequireDefault(_repeating);
  var _trimRight = require('trim-right');
  var _trimRight2 = _interopRequireDefault(_trimRight);
  var Buffer = (function() {
    function Buffer(position, format) {
      _classCallCheck(this, Buffer);
      this.printedCommentStarts = {};
      this.parenPushNewlineState = null;
      this.position = position;
      this._indent = format.indent.base;
      this.format = format;
      this.buf = "";
    }
    Buffer.prototype.catchUp = function catchUp(node) {
      if (node.loc && this.format.retainLines && this.buf) {
        while (this.position.line < node.loc.start.line) {
          this._push("\n");
        }
      }
    };
    Buffer.prototype.get = function get() {
      return _trimRight2["default"](this.buf);
    };
    Buffer.prototype.getIndent = function getIndent() {
      if (this.format.compact || this.format.concise) {
        return "";
      } else {
        return _repeating2["default"](this.format.indent.style, this._indent);
      }
    };
    Buffer.prototype.indentSize = function indentSize() {
      return this.getIndent().length;
    };
    Buffer.prototype.indent = function indent() {
      this._indent++;
    };
    Buffer.prototype.dedent = function dedent() {
      this._indent--;
    };
    Buffer.prototype.semicolon = function semicolon() {
      this.push(";");
    };
    Buffer.prototype.ensureSemicolon = function ensureSemicolon() {
      if (!this.isLast(";"))
        this.semicolon();
    };
    Buffer.prototype.rightBrace = function rightBrace() {
      this.newline(true);
      if (this.format.compact && !this._lastPrintedIsEmptyStatement) {
        this._removeLast(";");
      }
      this.push("}");
    };
    Buffer.prototype.keyword = function keyword(name) {
      this.push(name);
      this.space();
    };
    Buffer.prototype.space = function space(force) {
      if (!force && this.format.compact)
        return;
      if (force || this.buf && !this.isLast(" ") && !this.isLast("\n")) {
        this.push(" ");
      }
    };
    Buffer.prototype.removeLast = function removeLast(cha) {
      if (this.format.compact)
        return;
      return this._removeLast(cha);
    };
    Buffer.prototype._removeLast = function _removeLast(cha) {
      if (!this._isLast(cha))
        return;
      this.buf = this.buf.substr(0, this.buf.length - 1);
      this.position.unshift(cha);
    };
    Buffer.prototype.startTerminatorless = function startTerminatorless() {
      return this.parenPushNewlineState = {printed: false};
    };
    Buffer.prototype.endTerminatorless = function endTerminatorless(state) {
      if (state.printed) {
        this.dedent();
        this.newline();
        this.push(")");
      }
    };
    Buffer.prototype.newline = function newline(i, removeLast) {
      if (this.format.retainLines || this.format.compact)
        return;
      if (this.format.concise) {
        this.space();
        return;
      }
      removeLast = removeLast || false;
      if (typeof i === "number") {
        i = Math.min(2, i);
        if (this.endsWith("{\n") || this.endsWith(":\n"))
          i--;
        if (i <= 0)
          return;
        while (i > 0) {
          this._newline(removeLast);
          i--;
        }
        return;
      }
      if (typeof i === "boolean") {
        removeLast = i;
      }
      this._newline(removeLast);
    };
    Buffer.prototype._newline = function _newline(removeLast) {
      if (this.endsWith("\n\n"))
        return;
      if (removeLast && this.isLast("\n"))
        this.removeLast("\n");
      this.removeLast(" ");
      this._removeSpacesAfterLastNewline();
      this._push("\n");
    };
    Buffer.prototype._removeSpacesAfterLastNewline = function _removeSpacesAfterLastNewline() {
      var lastNewlineIndex = this.buf.lastIndexOf("\n");
      if (lastNewlineIndex === -1) {
        return;
      }
      var index = this.buf.length - 1;
      while (index > lastNewlineIndex) {
        if (this.buf[index] !== " ") {
          break;
        }
        index--;
      }
      if (index === lastNewlineIndex) {
        this.buf = this.buf.substring(0, index + 1);
      }
    };
    Buffer.prototype.push = function push(str, noIndent) {
      if (!this.format.compact && this._indent && !noIndent && str !== "\n") {
        var indent = this.getIndent();
        str = str.replace(/\n/g, "\n" + indent);
        if (this.isLast("\n"))
          this._push(indent);
      }
      this._push(str);
    };
    Buffer.prototype._push = function _push(str) {
      var parenPushNewlineState = this.parenPushNewlineState;
      if (parenPushNewlineState) {
        for (var i = 0; i < str.length; i++) {
          var cha = str[i];
          if (cha === " ")
            continue;
          this.parenPushNewlineState = null;
          if (cha === "\n" || cha === "/") {
            this._push("(");
            this.indent();
            parenPushNewlineState.printed = true;
          }
          break;
        }
      }
      this.position.push(str);
      this.buf += str;
    };
    Buffer.prototype.endsWith = function endsWith(str) {
      var buf = arguments.length <= 1 || arguments[1] === undefined ? this.buf : arguments[1];
      if (str.length === 1) {
        return buf[buf.length - 1] === str;
      } else {
        return buf.slice(-str.length) === str;
      }
    };
    Buffer.prototype.isLast = function isLast(cha) {
      if (this.format.compact)
        return false;
      return this._isLast(cha);
    };
    Buffer.prototype._isLast = function _isLast(cha) {
      var buf = this.buf;
      var last = buf[buf.length - 1];
      if (Array.isArray(cha)) {
        return cha.indexOf(last) >= 0;
      } else {
        return cha === last;
      }
    };
    return Buffer;
  })();
  exports["default"] = Buffer;
  module.exports = exports["default"];
})(require('buffer').Buffer);
