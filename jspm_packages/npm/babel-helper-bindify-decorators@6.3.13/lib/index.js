/* */ 
"use strict";

var _getIterator = require("babel-runtime/core-js/get-iterator")["default"];

var _interopRequireWildcard = require("babel-runtime/helpers/interop-require-wildcard")["default"];

exports.__esModule = true;
exports["default"] = bindifyDecorators;

var _babelTypes = require("babel-types");

var t = _interopRequireWildcard(_babelTypes);

/*:: import type { NodePath } from "babel-traverse"*/
function bindifyDecorators(decorators /*: Array<NodePath>*/) /*: Array<NodePath>*/ {
  for (var _iterator = decorators, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _getIterator(_iterator);;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var decoratorPath = _ref;

    var decorator = decoratorPath.node;
    var expression = decorator.expression;
    if (!t.isMemberExpression(expression)) continue;

    var temp = decoratorPath.scope.maybeGenerateMemoised(expression.object);
    var ref = undefined;

    var nodes = [];

    if (temp) {
      ref = temp;
      nodes.push(t.assignmentExpression("=", temp, expression.object));
    } else {
      ref = expression.object;
    }

    nodes.push(t.callExpression(t.memberExpression(t.memberExpression(ref, expression.property, expression.computed), t.identifier("bind")), [ref]));

    if (nodes.length === 1) {
      decorator.expression = nodes[0];
    } else {
      decorator.expression = t.sequenceExpression(nodes);
    }
  }
}

module.exports = exports["default"];