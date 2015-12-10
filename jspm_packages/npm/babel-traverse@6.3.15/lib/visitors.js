/* */ 
"use strict";
var _getIterator = require('babel-runtime/core-js/get-iterator')["default"];
var _Object$keys = require('babel-runtime/core-js/object/keys')["default"];
var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')["default"];
var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')["default"];
exports.__esModule = true;
exports.explode = explode;
exports.verify = verify;
exports.merge = merge;
var _pathLibVirtualTypes = require('./path/lib/virtual-types');
var virtualTypes = _interopRequireWildcard(_pathLibVirtualTypes);
var _babelMessages = require('babel-messages');
var messages = _interopRequireWildcard(_babelMessages);
var _babelTypes = require('babel-types');
var t = _interopRequireWildcard(_babelTypes);
var _lodashLangClone = require('lodash/lang/clone');
var _lodashLangClone2 = _interopRequireDefault(_lodashLangClone);
function explode(visitor) {
  if (visitor._exploded)
    return visitor;
  visitor._exploded = true;
  for (var nodeType in visitor) {
    if (shouldIgnoreKey(nodeType))
      continue;
    var parts = nodeType.split("|");
    if (parts.length === 1)
      continue;
    var fns = visitor[nodeType];
    delete visitor[nodeType];
    for (var _iterator = parts,
        _isArray = Array.isArray(_iterator),
        _i = 0,
        _iterator = _isArray ? _iterator : _getIterator(_iterator); ; ) {
      var _ref;
      if (_isArray) {
        if (_i >= _iterator.length)
          break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done)
          break;
        _ref = _i.value;
      }
      var part = _ref;
      visitor[part] = fns;
    }
  }
  verify(visitor);
  delete visitor.__esModule;
  ensureEntranceObjects(visitor);
  ensureCallbackArrays(visitor);
  for (var _iterator2 = (_Object$keys(visitor)),
      _isArray2 = Array.isArray(_iterator2),
      _i2 = 0,
      _iterator2 = _isArray2 ? _iterator2 : _getIterator(_iterator2); ; ) {
    var _ref2;
    if (_isArray2) {
      if (_i2 >= _iterator2.length)
        break;
      _ref2 = _iterator2[_i2++];
    } else {
      _i2 = _iterator2.next();
      if (_i2.done)
        break;
      _ref2 = _i2.value;
    }
    var nodeType = _ref2;
    if (shouldIgnoreKey(nodeType))
      continue;
    var wrapper = virtualTypes[nodeType];
    if (!wrapper)
      continue;
    var fns = visitor[nodeType];
    for (var type in fns) {
      fns[type] = wrapCheck(wrapper, fns[type]);
    }
    delete visitor[nodeType];
    if (wrapper.types) {
      for (var _iterator3 = (wrapper.types),
          _isArray3 = Array.isArray(_iterator3),
          _i3 = 0,
          _iterator3 = _isArray3 ? _iterator3 : _getIterator(_iterator3); ; ) {
        var _ref3;
        if (_isArray3) {
          if (_i3 >= _iterator3.length)
            break;
          _ref3 = _iterator3[_i3++];
        } else {
          _i3 = _iterator3.next();
          if (_i3.done)
            break;
          _ref3 = _i3.value;
        }
        var type = _ref3;
        if (visitor[type]) {
          mergePair(visitor[type], fns);
        } else {
          visitor[type] = fns;
        }
      }
    } else {
      mergePair(visitor, fns);
    }
  }
  for (var nodeType in visitor) {
    if (shouldIgnoreKey(nodeType))
      continue;
    var fns = visitor[nodeType];
    var aliases = t.FLIPPED_ALIAS_KEYS[nodeType];
    var deprecratedKey = t.DEPRECATED_KEYS[nodeType];
    if (deprecratedKey) {
      console.trace("Visitor defined for " + nodeType + " but it has been renamed to " + deprecratedKey);
      aliases = [deprecratedKey];
    }
    if (!aliases)
      continue;
    delete visitor[nodeType];
    for (var _iterator4 = aliases,
        _isArray4 = Array.isArray(_iterator4),
        _i4 = 0,
        _iterator4 = _isArray4 ? _iterator4 : _getIterator(_iterator4); ; ) {
      var _ref4;
      if (_isArray4) {
        if (_i4 >= _iterator4.length)
          break;
        _ref4 = _iterator4[_i4++];
      } else {
        _i4 = _iterator4.next();
        if (_i4.done)
          break;
        _ref4 = _i4.value;
      }
      var alias = _ref4;
      var existing = visitor[alias];
      if (existing) {
        mergePair(existing, fns);
      } else {
        visitor[alias] = _lodashLangClone2["default"](fns);
      }
    }
  }
  for (var nodeType in visitor) {
    if (shouldIgnoreKey(nodeType))
      continue;
    ensureCallbackArrays(visitor[nodeType]);
  }
  return visitor;
}
function verify(visitor) {
  if (visitor._verified)
    return;
  if (typeof visitor === "function") {
    throw new Error(messages.get("traverseVerifyRootFunction"));
  }
  for (var nodeType in visitor) {
    if (nodeType === "enter" || nodeType === "exit") {
      validateVisitorMethods(nodeType, visitor[nodeType]);
    }
    if (shouldIgnoreKey(nodeType))
      continue;
    if (t.TYPES.indexOf(nodeType) < 0) {
      throw new Error(messages.get("traverseVerifyNodeType", nodeType));
    }
    var visitors = visitor[nodeType];
    if (typeof visitors === "object") {
      for (var visitorKey in visitors) {
        if (visitorKey === "enter" || visitorKey === "exit") {
          validateVisitorMethods(nodeType + "." + visitorKey, visitors[visitorKey]);
        } else {
          throw new Error(messages.get("traverseVerifyVisitorProperty", nodeType, visitorKey));
        }
      }
    }
  }
  visitor._verified = true;
}
function validateVisitorMethods(path, val) {
  var fns = [].concat(val);
  for (var _iterator5 = fns,
      _isArray5 = Array.isArray(_iterator5),
      _i5 = 0,
      _iterator5 = _isArray5 ? _iterator5 : _getIterator(_iterator5); ; ) {
    var _ref5;
    if (_isArray5) {
      if (_i5 >= _iterator5.length)
        break;
      _ref5 = _iterator5[_i5++];
    } else {
      _i5 = _iterator5.next();
      if (_i5.done)
        break;
      _ref5 = _i5.value;
    }
    var fn = _ref5;
    if (typeof fn !== "function") {
      throw new TypeError("Non-function found defined in " + path + " with type " + typeof fn);
    }
  }
}
function merge(visitors) {
  var states = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
  var rootVisitor = {};
  for (var i = 0; i < visitors.length; i++) {
    var visitor = visitors[i];
    var state = states[i];
    explode(visitor);
    for (var type in visitor) {
      var visitorType = visitor[type];
      if (state)
        visitorType = wrapWithState(visitorType, state);
      var nodeVisitor = rootVisitor[type] = rootVisitor[type] || {};
      mergePair(nodeVisitor, visitorType);
    }
  }
  return rootVisitor;
}
function wrapWithState(oldVisitor, state) {
  var newVisitor = {};
  for (var key in oldVisitor) {
    var fns = oldVisitor[key];
    if (!Array.isArray(fns))
      continue;
    fns = fns.map(function(fn) {
      var newFn = function newFn(path) {
        return fn.call(state, path, state);
      };
      newFn.toString = function() {
        return fn.toString();
      };
      return newFn;
    });
    newVisitor[key] = fns;
  }
  return newVisitor;
}
function ensureEntranceObjects(obj) {
  for (var key in obj) {
    if (shouldIgnoreKey(key))
      continue;
    var fns = obj[key];
    if (typeof fns === "function") {
      obj[key] = {enter: fns};
    }
  }
}
function ensureCallbackArrays(obj) {
  if (obj.enter && !Array.isArray(obj.enter))
    obj.enter = [obj.enter];
  if (obj.exit && !Array.isArray(obj.exit))
    obj.exit = [obj.exit];
}
function wrapCheck(wrapper, fn) {
  var newFn = function newFn(path) {
    if (wrapper.checkPath(path)) {
      return fn.apply(this, arguments);
    }
  };
  newFn.toString = function() {
    return fn.toString();
  };
  return newFn;
}
function shouldIgnoreKey(key) {
  if (key[0] === "_")
    return true;
  if (key === "enter" || key === "exit" || key === "shouldSkip")
    return true;
  if (key === "blacklist" || key === "noScope" || key === "skipKeys")
    return true;
  return false;
}
function mergePair(dest, src) {
  for (var key in src) {
    dest[key] = [].concat(dest[key] || [], src[key]);
  }
}
