/* */ 
"use strict";
var _getIterator = require('babel-runtime/core-js/get-iterator')["default"];
var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')["default"];
var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')["default"];
exports.__esModule = true;
exports.findParent = findParent;
exports.find = find;
exports.getFunctionParent = getFunctionParent;
exports.getStatementParent = getStatementParent;
exports.getEarliestCommonAncestorFrom = getEarliestCommonAncestorFrom;
exports.getDeepestCommonAncestorFrom = getDeepestCommonAncestorFrom;
exports.getAncestry = getAncestry;
exports.inType = inType;
exports.inShadow = inShadow;
var _babelTypes = require('babel-types');
var t = _interopRequireWildcard(_babelTypes);
var _index = require('./index');
var _index2 = _interopRequireDefault(_index);
function findParent(callback) {
  var path = this;
  while (path = path.parentPath) {
    if (callback(path))
      return path;
  }
  return null;
}
function find(callback) {
  var path = this;
  do {
    if (callback(path))
      return path;
  } while (path = path.parentPath);
  return null;
}
function getFunctionParent() {
  return this.findParent(function(path) {
    return path.isFunction() || path.isProgram();
  });
}
function getStatementParent() {
  var path = this;
  do {
    if (Array.isArray(path.container)) {
      return path;
    }
  } while (path = path.parentPath);
}
function getEarliestCommonAncestorFrom(paths) {
  return this.getDeepestCommonAncestorFrom(paths, function(deepest, i, ancestries) {
    var earliest = undefined;
    var keys = t.VISITOR_KEYS[deepest.type];
    for (var _iterator = (ancestries),
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
      var ancestry = _ref;
      var path = ancestry[i + 1];
      if (!earliest) {
        earliest = path;
        continue;
      }
      if (path.listKey && earliest.listKey === path.listKey) {
        if (path.key < earliest.key) {
          earliest = path;
          continue;
        }
      }
      var earliestKeyIndex = keys.indexOf(earliest.parentKey);
      var currentKeyIndex = keys.indexOf(path.parentKey);
      if (earliestKeyIndex > currentKeyIndex) {
        earliest = path;
      }
    }
    return earliest;
  });
}
function getDeepestCommonAncestorFrom(paths, filter) {
  var _this = this;
  if (!paths.length) {
    return this;
  }
  if (paths.length === 1) {
    return paths[0];
  }
  var minDepth = Infinity;
  var lastCommonIndex = undefined,
      lastCommon = undefined;
  var ancestries = paths.map(function(path) {
    var ancestry = [];
    do {
      ancestry.unshift(path);
    } while ((path = path.parentPath) && path !== _this);
    if (ancestry.length < minDepth) {
      minDepth = ancestry.length;
    }
    return ancestry;
  });
  var first = ancestries[0];
  depthLoop: for (var i = 0; i < minDepth; i++) {
    var shouldMatch = first[i];
    for (var _iterator2 = (ancestries),
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
      var ancestry = _ref2;
      if (ancestry[i] !== shouldMatch) {
        break depthLoop;
      }
    }
    lastCommonIndex = i;
    lastCommon = shouldMatch;
  }
  if (lastCommon) {
    if (filter) {
      return filter(lastCommon, lastCommonIndex, ancestries);
    } else {
      return lastCommon;
    }
  } else {
    throw new Error("Couldn't find intersection");
  }
}
function getAncestry() {
  var path = this;
  var paths = [];
  do {
    paths.push(path);
  } while (path = path.parentPath);
  return paths;
}
function inType() {
  var path = this;
  while (path) {
    for (var _iterator3 = (arguments),
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
      if (path.node.type === type)
        return true;
    }
    path = path.parentPath;
  }
  return false;
}
function inShadow(key) {
  var path = this;
  do {
    if (path.isFunction()) {
      var shadow = path.node.shadow;
      if (shadow) {
        if (!key || shadow[key] !== false) {
          return path;
        }
      } else if (path.isArrowFunctionExpression()) {
        return path;
      }
      return null;
    }
  } while (path = path.parentPath);
  return null;
}
