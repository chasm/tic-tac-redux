/* */ 
"use strict";
var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')["default"];
var _utilLocation = require('../util/location');
var _index = require('./index');
var _index2 = _interopRequireDefault(_index);
var pp = _index2["default"].prototype;
pp.raise = function(pos, message) {
  var loc = _utilLocation.getLineInfo(this.input, pos);
  message += " (" + loc.line + ":" + loc.column + ")";
  var err = new SyntaxError(message);
  err.pos = pos;
  err.loc = loc;
  throw err;
};
