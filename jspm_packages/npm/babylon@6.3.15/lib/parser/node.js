/* */ 
"use strict";
var _classCallCheck = require('babel-runtime/helpers/class-call-check')["default"];
var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')["default"];
var _index = require('./index');
var _index2 = _interopRequireDefault(_index);
var _utilLocation = require('../util/location');
var pp = _index2["default"].prototype;
var Node = (function() {
  function Node(pos, loc) {
    _classCallCheck(this, Node);
    this.type = "";
    this.start = pos;
    this.end = 0;
    this.loc = new _utilLocation.SourceLocation(loc);
  }
  Node.prototype.__clone = function __clone() {
    var node2 = new Node();
    for (var key in this) {
      node2[key] = this[key];
    }
    return node2;
  };
  return Node;
})();
pp.startNode = function() {
  return new Node(this.state.start, this.state.startLoc);
};
pp.startNodeAt = function(pos, loc) {
  return new Node(pos, loc);
};
function finishNodeAt(node, type, pos, loc) {
  node.type = type;
  node.end = pos;
  node.loc.end = loc;
  this.processComment(node);
  return node;
}
pp.finishNode = function(node, type) {
  return finishNodeAt.call(this, node, type, this.state.lastTokEnd, this.state.lastTokEndLoc);
};
pp.finishNodeAt = function(node, type, pos, loc) {
  return finishNodeAt.call(this, node, type, pos, loc);
};
