/* */ 
'use strict';
exports.__esModule = true;
var _extends = Object.assign || function(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {'default': obj};
}
var _deepEqual = require('deep-equal');
var _deepEqual2 = _interopRequireDefault(_deepEqual);
var _AsyncUtils = require('./AsyncUtils');
var _Actions = require('./Actions');
var _createLocation2 = require('./createLocation');
var _createLocation3 = _interopRequireDefault(_createLocation2);
var _parsePath = require('./parsePath');
var _parsePath2 = _interopRequireDefault(_parsePath);
var _runTransitionHook = require('./runTransitionHook');
var _runTransitionHook2 = _interopRequireDefault(_runTransitionHook);
var _deprecate = require('./deprecate');
var _deprecate2 = _interopRequireDefault(_deprecate);
function createRandomKey(length) {
  return Math.random().toString(36).substr(2, length);
}
function locationsAreEqual(a, b) {
  return a.pathname === b.pathname && a.search === b.search && a.key === b.key && _deepEqual2['default'](a.state, b.state);
}
var DefaultKeyLength = 6;
function createHistory() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var getCurrentLocation = options.getCurrentLocation;
  var finishTransition = options.finishTransition;
  var saveState = options.saveState;
  var go = options.go;
  var keyLength = options.keyLength;
  var getUserConfirmation = options.getUserConfirmation;
  if (typeof keyLength !== 'number')
    keyLength = DefaultKeyLength;
  var transitionHooks = [];
  function listenBefore(hook) {
    transitionHooks.push(hook);
    return function() {
      transitionHooks = transitionHooks.filter(function(item) {
        return item !== hook;
      });
    };
  }
  var allKeys = [];
  var changeListeners = [];
  var location = undefined;
  function getCurrent() {
    if (pendingLocation && pendingLocation.action === _Actions.POP) {
      return allKeys.indexOf(pendingLocation.key);
    } else if (location) {
      return allKeys.indexOf(location.key);
    } else {
      return -1;
    }
  }
  function updateLocation(newLocation) {
    var current = getCurrent();
    location = newLocation;
    if (location.action === _Actions.PUSH) {
      allKeys = [].concat(allKeys.slice(0, current + 1), [location.key]);
    } else if (location.action === _Actions.REPLACE) {
      allKeys[current] = location.key;
    }
    changeListeners.forEach(function(listener) {
      listener(location);
    });
  }
  function listen(listener) {
    changeListeners.push(listener);
    if (location) {
      listener(location);
    } else {
      var _location = getCurrentLocation();
      allKeys = [_location.key];
      updateLocation(_location);
    }
    return function() {
      changeListeners = changeListeners.filter(function(item) {
        return item !== listener;
      });
    };
  }
  function confirmTransitionTo(location, callback) {
    _AsyncUtils.loopAsync(transitionHooks.length, function(index, next, done) {
      _runTransitionHook2['default'](transitionHooks[index], location, function(result) {
        if (result != null) {
          done(result);
        } else {
          next();
        }
      });
    }, function(message) {
      if (getUserConfirmation && typeof message === 'string') {
        getUserConfirmation(message, function(ok) {
          callback(ok !== false);
        });
      } else {
        callback(message !== false);
      }
    });
  }
  var pendingLocation = undefined;
  function transitionTo(nextLocation) {
    if (location && locationsAreEqual(location, nextLocation))
      return;
    pendingLocation = nextLocation;
    confirmTransitionTo(nextLocation, function(ok) {
      if (pendingLocation !== nextLocation)
        return;
      if (ok) {
        if (nextLocation.action === _Actions.PUSH) {
          var prevPath = createPath(location);
          var nextPath = createPath(nextLocation);
          if (nextPath === prevPath)
            nextLocation.action = _Actions.REPLACE;
        }
        if (finishTransition(nextLocation) !== false)
          updateLocation(nextLocation);
      } else if (location && nextLocation.action === _Actions.POP) {
        var prevIndex = allKeys.indexOf(location.key);
        var nextIndex = allKeys.indexOf(nextLocation.key);
        if (prevIndex !== -1 && nextIndex !== -1)
          go(prevIndex - nextIndex);
      }
    });
  }
  function push(location) {
    transitionTo(createLocation(location, null, _Actions.PUSH, createKey()));
  }
  function replace(location) {
    transitionTo(createLocation(location, null, _Actions.REPLACE, createKey()));
  }
  function goBack() {
    go(-1);
  }
  function goForward() {
    go(1);
  }
  function createKey() {
    return createRandomKey(keyLength);
  }
  function createPath(path) {
    if (path == null || typeof path === 'string')
      return path;
    var pathname = path.pathname;
    var search = path.search;
    var hash = path.hash;
    var result = pathname;
    if (search)
      result += search;
    if (hash)
      result += hash;
    return result;
  }
  function createHref(path) {
    return createPath(path);
  }
  function createLocation(path, state, action) {
    var key = arguments.length <= 3 || arguments[3] === undefined ? createKey() : arguments[3];
    return _createLocation3['default'](path, state, action, key);
  }
  function setState(state) {
    if (location) {
      updateLocationState(location, state);
      updateLocation(location);
    } else {
      updateLocationState(getCurrentLocation(), state);
    }
  }
  function updateLocationState(location, state) {
    location.state = _extends({}, location.state, state);
    saveState(location.key, location.state);
  }
  function registerTransitionHook(hook) {
    if (transitionHooks.indexOf(hook) === -1)
      transitionHooks.push(hook);
  }
  function unregisterTransitionHook(hook) {
    transitionHooks = transitionHooks.filter(function(item) {
      return item !== hook;
    });
  }
  function pushState(state, path) {
    if (typeof path === 'string')
      path = _parsePath2['default'](path);
    push(_extends({state: state}, path));
  }
  function replaceState(state, path) {
    if (typeof path === 'string')
      path = _parsePath2['default'](path);
    replace(_extends({state: state}, path));
  }
  return {
    listenBefore: listenBefore,
    listen: listen,
    transitionTo: transitionTo,
    push: push,
    replace: replace,
    go: go,
    goBack: goBack,
    goForward: goForward,
    createKey: createKey,
    createPath: createPath,
    createHref: createHref,
    createLocation: createLocation,
    setState: _deprecate2['default'](setState, 'setState is deprecated; use location.key to save state instead'),
    registerTransitionHook: _deprecate2['default'](registerTransitionHook, 'registerTransitionHook is deprecated; use listenBefore instead'),
    unregisterTransitionHook: _deprecate2['default'](unregisterTransitionHook, 'unregisterTransitionHook is deprecated; use the callback returned from listenBefore instead'),
    pushState: _deprecate2['default'](pushState, 'pushState is deprecated; use push instead'),
    replaceState: _deprecate2['default'](replaceState, 'replaceState is deprecated; use replace instead')
  };
}
exports['default'] = createHistory;
module.exports = exports['default'];
