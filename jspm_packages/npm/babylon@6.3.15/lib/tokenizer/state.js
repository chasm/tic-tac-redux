/* */ 
"use strict";
var _classCallCheck = require('babel-runtime/helpers/class-call-check')["default"];
exports.__esModule = true;
var _utilLocation = require('../util/location');
var _context = require('./context');
var _types = require('./types');
var State = (function() {
  function State() {
    _classCallCheck(this, State);
  }
  State.prototype.init = function init(options, input) {
    this.strict = options.strictMode === false ? false : options.sourceType === "module";
    this.input = input;
    this.potentialArrowAt = -1;
    this.inMethod = this.inFunction = this.inGenerator = this.inAsync = false;
    this.labels = [];
    this.decorators = [];
    this.tokens = [];
    this.comments = [];
    this.trailingComments = [];
    this.leadingComments = [];
    this.commentStack = [];
    this.pos = this.lineStart = 0;
    this.curLine = 1;
    this.type = _types.types.eof;
    this.value = null;
    this.start = this.end = this.pos;
    this.startLoc = this.endLoc = this.curPosition();
    this.lastTokEndLoc = this.lastTokStartLoc = null;
    this.lastTokStart = this.lastTokEnd = this.pos;
    this.context = [_context.types.b_stat];
    this.exprAllowed = true;
    this.containsEsc = this.containsOctal = false;
    this.octalPosition = null;
    return this;
  };
  State.prototype.curPosition = function curPosition() {
    return new _utilLocation.Position(this.curLine, this.pos - this.lineStart);
  };
  State.prototype.clone = function clone(skipArrays) {
    var state = new State();
    for (var key in this) {
      var val = this[key];
      if ((!skipArrays || key === "context") && Array.isArray(val)) {
        val = val.slice();
      }
      state[key] = val;
    }
    return state;
  };
  return State;
})();
exports["default"] = State;
module.exports = exports["default"];
