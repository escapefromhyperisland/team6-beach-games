/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/aframe-state-component/dist/aframe-state-component.js":
/*!****************************************************************************!*\
  !*** ./node_modules/aframe-state-component/dist/aframe-state-component.js ***!
  \****************************************************************************/
/***/ (function(module) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else { var i, a; }
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __nested_webpack_require_573__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __nested_webpack_require_573__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__nested_webpack_require_573__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__nested_webpack_require_573__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__nested_webpack_require_573__.d = function(exports, name, getter) {
/******/ 		if(!__nested_webpack_require_573__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__nested_webpack_require_573__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__nested_webpack_require_573__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__nested_webpack_require_573__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__nested_webpack_require_573__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __nested_webpack_require_573__(__nested_webpack_require_573__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Pre-compiled functions.
var selectFunctions = {};

/**
 * Select value from store. Handles boolean operations, calls `selectProperty`.
 *
 * @param {object} state - State object.
 * @param {string} selector - Dot-delimited store keys (e.g., game.player.health).
 * @param {object} item - From bind-item.
 */
function select(state, selector, item) {
  if (!selectFunctions[selector]) {
    selectFunctions[selector] = new Function('state', 'item', 'return ' + generateExpression(selector) + ';');
  }
  return selectFunctions[selector](state, item);
}
module.exports.select = select;

var DOT_NOTATION_RE = /\.([A-Za-z][\w_-]*)/g;
var WHITESPACE_RE = /\s/g;
var STATE_SELECTOR_RE = /([=&|!?:+-])(\s*)([\(]?)([A-Za-z][\w_-]*)/g;
var ROOT_STATE_SELECTOR_RE = /^([\(]?)([A-Za-z][\w_-]*)/g;
var ITEM_RE = /state\["item"\]/g;
var BOOLEAN_RE = /state\["(true|false)"\]/g;
var STATE_STR = 'state';
function generateExpression(str) {
  str = str.replace(DOT_NOTATION_RE, '["$1"]');
  str = str.replace(ROOT_STATE_SELECTOR_RE, '$1state["$2"]');
  str = str.replace(STATE_SELECTOR_RE, '$1$2$3state["$4"]');
  str = str.replace(ITEM_RE, 'item');
  str = str.replace(BOOLEAN_RE, '$1');
  return str;
}
module.exports.generateExpression = generateExpression;

function clearObject(obj) {
  for (var key in obj) {
    delete obj[key];
  }
}
module.exports.clearObject = clearObject;

/**
 * Helper to compose object of handlers, merging functions handling same action.
 */
function composeHandlers() {
  var actionName;
  var i;
  var inputHandlers = arguments;
  var outputHandlers;

  outputHandlers = {};
  for (i = 0; i < inputHandlers.length; i++) {
    for (actionName in inputHandlers[i]) {
      if (actionName in outputHandlers) {
        // Initial compose/merge functions into arrays.
        if (outputHandlers[actionName].constructor === Array) {
          outputHandlers[actionName].push(inputHandlers[i][actionName]);
        } else {
          outputHandlers[actionName] = [outputHandlers[actionName], inputHandlers[i][actionName]];
        }
      } else {
        outputHandlers[actionName] = inputHandlers[i][actionName];
      }
    }
  }

  // Compose functions specified via array.
  for (actionName in outputHandlers) {
    if (outputHandlers[actionName].constructor === Array) {
      outputHandlers[actionName] = composeFunctions.apply(this, outputHandlers[actionName]);
    }
  }

  return outputHandlers;
}
module.exports.composeHandlers = composeHandlers;

function composeFunctions() {
  var functions = arguments;
  return function () {
    var i;
    for (i = 0; i < functions.length; i++) {
      functions[i].apply(this, arguments);
    }
  };
}
module.exports.composeFunctions = composeFunctions;

var NO_WATCH_TOKENS = ['||', '&&', '!=', '!==', '==', '===', '>', '<', '<=', '>='];
var WHITESPACE_PLUS_RE = /\s+/;
var SYMBOLS = /\(|\)|\!/g;
function parseKeysToWatch(keys, str, isBindItem) {
  var i;
  var tokens;
  tokens = split(str, WHITESPACE_PLUS_RE);
  for (i = 0; i < tokens.length; i++) {
    if (NO_WATCH_TOKENS.indexOf(tokens[i]) === -1 && !tokens[i].startsWith("'") && keys.indexOf(tokens[i]) === -1) {
      if (isBindItem && tokens[i] === 'item') {
        continue;
      }
      keys.push(parseKeyToWatch(tokens[i]).replace(SYMBOLS, ''));
    }
  }
  return keys;
}
module.exports.parseKeysToWatch = parseKeysToWatch;

function parseKeyToWatch(str) {
  var dotIndex;
  str = stripNot(str.trim());
  dotIndex = str.indexOf('.');
  if (dotIndex === -1) {
    return str;
  }
  return str.substring(0, str.indexOf('.'));
}

function stripNot(str) {
  if (str.indexOf('!!') === 0) {
    return str.replace('!!', '');
  } else if (str.indexOf('!') === 0) {
    return str.replace('!', '');
  }
  return str;
}

/**
 * Cached split.
 */
var SPLIT_CACHE = {};
function split(str, delimiter) {
  if (!SPLIT_CACHE[delimiter]) {
    SPLIT_CACHE[delimiter] = {};
  }
  if (SPLIT_CACHE[delimiter][str]) {
    return SPLIT_CACHE[delimiter][str];
  }
  SPLIT_CACHE[delimiter][str] = str.split(delimiter);
  return SPLIT_CACHE[delimiter][str];
}
module.exports.split = split;

function copyArray(dest, src) {
  var i;
  dest.length = 0;
  for (i = 0; i < src.length; i++) {
    dest[i] = src[i];
  }
}
module.exports.copyArray = copyArray;

/***/ }),
/* 1 */
/***/ (function(module, exports, __nested_webpack_require_7205__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

__nested_webpack_require_7205__(2);
var diff = __nested_webpack_require_7205__(3);
var lib = __nested_webpack_require_7205__(0);
var wrapArray = __nested_webpack_require_7205__(4).wrapArray;

// Singleton state definition.
var State = {
  initialState: {},
  nonBindedStateKeys: [],
  handlers: {},
  computeState: [function () {/* no-op */}]
};

var STATE_UPDATE_EVENT = 'stateupdate';
var TYPE_OBJECT = 'object';
var WHITESPACE_REGEX = /s+/;

AFRAME.registerState = function (definition) {
  var computeState = State.computeState;
  if (definition.computeState) {
    computeState.push(definition.computeState);
  }
  AFRAME.utils.extendDeep(State, definition);
  State.computeState = computeState;
};

AFRAME.registerSystem('state', {
  init: function init() {
    var _this = this;

    var key;

    this.arrays = [];
    this.dirtyArrays = [];
    this.diff = {};
    this.state = AFRAME.utils.clone(State.initialState);
    this.subscriptions = [];
    this.initEventHandlers();

    // Wrap array to detect dirty.
    for (key in this.state) {
      if (this.state[key] && this.state[key].constructor === Array) {
        this.arrays.push(key);
        this.state[key].__dirty = true;
        wrapArray(this.state[key]);
      }
    }

    this.lastState = AFRAME.utils.clone(this.state);

    this.eventDetail = {
      lastState: this.lastState,
      state: this.state
    };

    this.el.addEventListener('loaded', function () {
      var i;
      // Initial compute.
      for (i = 0; i < State.computeState.length; i++) {
        State.computeState[i](_this.state, '@@INIT');
      }
      // Initial dispatch.
      for (i = 0; i < _this.subscriptions.length; i++) {
        _this.subscriptions[i].onStateUpdate(_this.state);
      }
    });
  },

  /**
   * Dispatch action.
   */
  dispatch: function () {
    var toUpdate = [];

    return function (actionName, payload) {
      var dirtyArrays;
      var i;
      var key;
      var subscription;

      // Modify state.
      State.handlers[actionName](this.state, payload);

      // Post-compute.
      for (i = 0; i < State.computeState.length; i++) {
        State.computeState[i](this.state, actionName, payload);
      }

      // Get a diff to optimize bind updates.
      for (key in this.diff) {
        delete this.diff[key];
      }
      diff(this.lastState, this.state, this.diff, State.nonBindedStateKeys);

      this.dirtyArrays.length = 0;
      for (i = 0; i < this.arrays.length; i++) {
        if (this.state[this.arrays[i]].__dirty) {
          this.dirtyArrays.push(this.arrays[i]);
        }
      }

      // Notify subscriptions / binders.
      toUpdate.length = 0;
      for (i = 0; i < this.subscriptions.length; i++) {
        if (this.subscriptions[i].name === 'bind-for') {
          // For arrays and bind-for, check __dirty flag on array rather than the diff.
          if (!this.state[this.subscriptions[i].keysToWatch[0]].__dirty) {
            continue;
          }
        } else {
          if (!this.shouldUpdate(this.subscriptions[i].keysToWatch, this.diff, this.dirtyArrays)) {
            continue;
          }
        }

        // Keep track to only update subscriptions once.
        if (toUpdate.indexOf(this.subscriptions[i]) === -1) {
          toUpdate.push(this.subscriptions[i]);
        }
      }

      // Update subscriptions.
      for (i = 0; i < toUpdate.length; i++) {
        toUpdate[i].onStateUpdate();
      }

      // Unset array dirty.
      for (key in this.state) {
        if (this.state[key] && this.state[key].constructor === Array) {
          this.state[key].__dirty = false;
        }
      }

      // Store last state.
      this.copyState(this.lastState, this.state);

      // Emit.
      this.eventDetail.action = actionName;
      this.eventDetail.payload = payload;
      this.el.emit(STATE_UPDATE_EVENT, this.eventDetail);
    };
  }(),

  /**
   * Store last state through a deep extend, but not for arrays.
   */
  copyState: function copyState(lastState, state, isRecursive) {
    var key;

    for (key in state) {
      // Don't copy pieces of state keys that are non-binded or untracked.
      if (!isRecursive && State.nonBindedStateKeys.indexOf(key) !== -1) {
        continue;
      }

      // Nested state.
      if (state[key] && state[key].constructor === Object) {
        if (!(key in lastState)) {
          // Clone object if destination does not exist.
          lastState[key] = AFRAME.utils.clone(state[key]);
          continue;
        }
        // Recursively copy state.
        this.copyState(lastState[key], state[key], true);
        continue;
      }

      // Copy by value.
      lastState[key] = state[key];
    }
  },

  subscribe: function subscribe(component) {
    this.subscriptions.push(component);
  },

  unsubscribe: function unsubscribe(component) {
    this.subscriptions.splice(this.subscriptions.indexOf(component), 1);
  },

  /**
   * Check if state changes were relevant to this binding. If not, don't call.
   */
  shouldUpdate: function shouldUpdate(keysToWatch, diff, dirtyArrays) {
    for (var i = 0; i < keysToWatch.length; i++) {
      if (keysToWatch[i] in diff || dirtyArrays.indexOf(keysToWatch[i]) !== -1) {
        return true;
      }
    }
    return false;
  },

  /**
   * Proxy events to action dispatches so components can just bubble actions up as events.
   * Handlers define which actions they handle. Go through all and add event listeners.
   */
  initEventHandlers: function initEventHandlers() {
    var actionName;
    var registeredActions = [];
    var self = this;

    registerListener = registerListener.bind(this);

    // Use declared handlers to know what events to listen to.
    for (actionName in State.handlers) {
      // Only need to register one handler for each event.
      if (registeredActions.indexOf(actionName) !== -1) {
        continue;
      }
      registeredActions.push(actionName);
      registerListener(actionName);
    }

    function registerListener(actionName) {
      var _this2 = this;

      this.el.addEventListener(actionName, function (evt) {
        _this2.dispatch(actionName, evt.detail);
      });
    }
  },

  /**
   * Render template to string with item data.
   */
  renderTemplate: function () {
    // Braces, whitespace, optional item name, item key, whitespace, braces.
    var interpRegex = /{{\s*(\w*\.)?([\w.]+)\s*}}/g;

    return function (template, data, asString) {
      var match;
      var str;

      str = template;

      // Data will be null if initialize pool for bind-for.updateInPlace.
      if (data) {
        while (match = interpRegex.exec(template)) {
          str = str.replace(match[0], (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === TYPE_OBJECT ? lib.select(data, match[2]) || '' : data);
        }
      }

      // Return as string.
      if (asString) {
        return str;
      }

      // Return as DOM.
      return document.createRange().createContextualFragment(str);
    };
  }(),

  select: lib.select
});

/**
 * Bind component property to a value in state.
 *
 * bind="geometry.width: car.width""
 * bind__material="color: enemy.color; opacity: enemy.opacity"
 * bind__visible="player.visible"
 */
AFRAME.registerComponent('bind', {
  schema: {
    default: {},
    parse: function parse(value) {
      // Parse style-like object.
      var data;
      var i;
      var properties;
      var pair;

      // Using setAttribute with object, no need to parse.
      if (value.constructor === Object) {
        return value;
      }

      // Using instanced ID as component namespace for single-property component,
      // nothing to separate.
      if (value.indexOf(':') === -1) {
        return value;
      }

      // Parse style-like object as keys to values.
      data = {};
      properties = lib.split(value, ';');
      for (i = 0; i < properties.length; i++) {
        pair = lib.split(properties[i].trim(), ':');
        data[pair[0]] = pair[1].trim();
      }
      return data;
    }
  },

  multiple: true,

  init: function init() {
    var componentId;
    var data = this.data;
    var key;

    this.keysToWatch = [];
    this.onStateUpdate = this.onStateUpdate.bind(this);
    this.system = this.el.sceneEl.systems.state;

    // Whether we are binding by namespace (e.g., bind__foo="prop1: true").
    if (this.id) {
      componentId = lib.split(this.id, '__')[0];
    }

    this.isNamespacedBind = this.id && componentId in AFRAME.components && !AFRAME.components[componentId].isSingleProp || componentId in AFRAME.systems;

    this.lastData = {};
    this.updateObj = {};

    // Subscribe to store and register handler to do data-binding to components.
    this.system.subscribe(this);

    this.onStateUpdate = this.onStateUpdate.bind(this);
  },

  update: function update() {
    var data = this.data;
    var key;
    var property;

    // Index `keysToWatch` to only update state on relevant changes.
    this.keysToWatch.length = 0;
    if (typeof data === 'string') {
      lib.parseKeysToWatch(this.keysToWatch, data);
    } else {
      for (key in data) {
        lib.parseKeysToWatch(this.keysToWatch, data[key]);
      }
    }

    this.onStateUpdate();
  },

  /**
   * Handle state update.
   */
  onStateUpdate: function onStateUpdate() {
    // Update component with the state.
    var hasKeys = false;
    var el = this.el;
    var propertyName;
    var stateSelector;
    var state;
    var tempNode;
    var value;

    if (!el.parentNode) {
      return;
    }
    if (this.isNamespacedBind) {
      lib.clearObject(this.updateObj);
    }

    state = this.system.state;

    // Single-property bind.
    if (_typeof(this.data) !== TYPE_OBJECT) {
      try {
        value = lib.select(state, this.data);
      } catch (e) {
        throw new Error('[aframe-state-component] Key \'' + this.data + '\' not found in state.' + (' #' + this.el.getAttribute('id') + '[' + this.attrName + ']'));
      }

      if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== TYPE_OBJECT && _typeof(this.lastData) !== TYPE_OBJECT && this.lastData === value) {
        return;
      }

      AFRAME.utils.entity.setComponentProperty(el, this.id, value);
      this.lastData = value;
      return;
    }

    for (propertyName in this.data) {
      // Pointer to a value in the state (e.g., `player.health`).
      stateSelector = this.data[propertyName].trim();
      try {
        value = lib.select(state, stateSelector);
      } catch (e) {
        console.log(e);
        throw new Error('[aframe-state-component] Key \'' + stateSelector + '\' not found in state.' + (' #' + this.el.getAttribute('id') + '[' + this.attrName + ']'));
      }

      if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== TYPE_OBJECT && _typeof(this.lastData[propertyName]) !== TYPE_OBJECT && this.lastData[propertyName] === value) {
        continue;
      }

      // Remove component if value is `undefined`.
      if (propertyName in AFRAME.components && value === undefined) {
        el.removeAttribute(propertyName);
        return;
      }

      // Set using dot-delimited property name.
      if (this.isNamespacedBind) {
        // Batch if doing namespaced bind.
        this.updateObj[propertyName] = value;
      } else {
        AFRAME.utils.entity.setComponentProperty(el, propertyName, value);
      }

      this.lastData[propertyName] = value;
    }

    // Batch if doing namespaced bind.
    for (hasKeys in this.updateObj) {
      // See if object is empty.
    }
    if (this.isNamespacedBind && hasKeys) {
      el.setAttribute(this.id, this.updateObj);
    }
  },

  remove: function remove() {
    this.system.unsubscribe(this);
  }
});

/**
 * Toggle component attach and detach based on boolean value.
 *
 * bind-toggle__raycastable="isRaycastable""
 */
AFRAME.registerComponent('bind-toggle', {
  schema: { type: 'string' },

  multiple: true,

  init: function init() {
    this.system = this.el.sceneEl.systems.state;
    this.keysToWatch = [];
    this.onStateUpdate = this.onStateUpdate.bind(this);

    // Subscribe to store and register handler to do data-binding to components.
    this.system.subscribe(this);

    this.onStateUpdate();
  },

  update: function update() {
    this.keysToWatch.length = 0;
    lib.parseKeysToWatch(this.keysToWatch, this.data);
  },

  /**
   * Handle state update.
   */
  onStateUpdate: function onStateUpdate() {
    var el = this.el;
    var state;
    var value;

    state = this.system.state;

    try {
      value = lib.select(state, this.data);
    } catch (e) {
      throw new Error('[aframe-state-component] Key \'' + this.data + '\' not found in state.' + (' #' + this.el.getAttribute('id') + '[' + this.attrName + ']'));
    }

    if (value) {
      el.setAttribute(this.id, '');
    } else {
      el.removeAttribute(this.id);
    }
  },

  remove: function remove() {
    this.system.unsubscribe(this);
  }
});

module.exports = {
  composeFunctions: lib.composeFunctions,
  composeHandlers: lib.composeHandlers,
  select: lib.select
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __nested_webpack_require_20623__) {

"use strict";


var lib = __nested_webpack_require_20623__(0);

var ITEM_RE = /item/;
var ITEM_PREFIX_RE = /item./;
var ITEM_SELECTOR_RE = /item.(\w+)/;

/**
 * Render array from state.
 */
AFRAME.registerComponent('bind-for', {
  schema: {
    delay: { default: 0 },
    for: { type: 'string', default: 'item' },
    in: { type: 'string' },
    key: { type: 'string' },
    pool: { default: 0 },
    template: { type: 'string' },
    updateInPlace: { default: false }
  },

  init: function init() {
    // Subscribe to store and register handler to do data-binding to components.
    this.system = this.el.sceneEl.systems.state;
    this.onStateUpdate = this.onStateUpdate.bind(this);

    this.keysToWatch = [];
    this.renderedKeys = []; // Keys that are currently rendered.
    this.system.subscribe(this);

    if (this.el.children[0] && this.el.children[0].tagName === 'TEMPLATE') {
      this.template = this.el.children[0].innerHTML.trim();
    } else {
      this.template = document.querySelector(this.data.template).innerHTML.trim();
    }

    for (var i = 0; i < this.data.pool; i++) {
      this.el.appendChild(this.generateFromTemplate(null, i));
    }
  },

  update: function update() {
    this.keysToWatch[0] = lib.split(this.data.in, '.')[0];
    this.onStateUpdate();
  },

  /**
   * When items are swapped out, the old ones are removed, and new ones are added. All
   * entities will be reinitialized.
   */
  onStateUpdateNaive: function () {
    var activeKeys = [];

    return function () {
      var child;
      var data = this.data;
      var el = this.el;
      var list;
      var key;
      var keyValue;

      try {
        list = lib.select(this.system.state, data.in);
      } catch (e) {
        throw new Error('[aframe-state-component] Key \'' + data.in + '\' not found in state.' + (' #' + el.getAttribute('id') + '[' + this.attrName + ']'));
      }

      activeKeys.length = 0;
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        // If key not defined, use index (e.g., array of strings).
        activeKeys.push(data.key ? item[data.key].toString() : item.toString());
      }

      // Remove items by removing entities.
      var toRemoveEls = this.getElsToRemove(activeKeys, this.renderedKeys);
      for (var _i = 0; _i < toRemoveEls.length; _i++) {
        toRemoveEls[_i].parentNode.removeChild(toRemoveEls[_i]);
      }

      if (list.length) {
        this.renderItems(list, activeKeys, 0);
      }
    };
  }(),

  /**
   * Add or update item with delay support.
   */
  renderItems: function renderItems(list, activeKeys, i) {
    var _this = this;

    var data = this.data;
    var el = this.el;
    var itemEl;
    var item = list[i];

    // If key not defined, use index (e.g., array of strings).
    var keyValue = data.key ? item[data.key].toString() : item.toString();

    if (this.renderedKeys.indexOf(keyValue) === -1) {
      // Add.
      itemEl = this.generateFromTemplate(item, i);
      el.appendChild(itemEl);
      this.renderedKeys.push(keyValue);
    } else {
      // Update.
      if (list.length && list[0].constructor === String) {
        // Update index for simple list.
        var _keyValue = data.key ? item[data.key].toString() : item.toString();
        itemEl = el.querySelector('[data-bind-for-value="' + _keyValue + '"]');
        itemEl.setAttribute('data-bind-for-key', i);
      } else {
        var bindForKey = this.getBindForKey(item, i);
        itemEl = el.querySelector('[data-bind-for-key="' + bindForKey + '"]');
      }
      itemEl.emit('bindforupdate', item, false);
    }

    if (!list[i + 1]) {
      return;
    }

    if (this.data.delay) {
      setTimeout(function () {
        _this.renderItems(list, activeKeys, i + 1);
      }, this.data.delay);
    } else {
      this.renderItems(list, activeKeys, i + 1);
    }
  },

  /**
   * When items are swapped out, this algorithm will update component values in-place using
   * bind-item.
   */
  onStateUpdateInPlace: function () {
    var activeKeys = [];

    return function () {
      var data = this.data;
      var el = this.el;
      var list;
      var key;
      var keyValue;

      try {
        list = lib.select(this.system.state, data.in);
      } catch (e) {
        console.log(e);
        throw new Error('[aframe-state-component] Key \'' + data.in + '\' not found in state.' + (' #' + el.getAttribute('id') + '[' + this.attrName + ']'));
      }

      // Calculate keys that should be active.
      activeKeys.length = 0;
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        keyValue = data.key ? item[data.key].toString() : item.toString();
        activeKeys.push(keyValue);
      }

      // Remove items by pooling. Do before adding.
      var toRemoveEls = this.getElsToRemove(activeKeys, this.renderedKeys);
      for (var _i2 = 0; _i2 < toRemoveEls.length; _i2++) {
        toRemoveEls[_i2].object3D.visible = false;
        toRemoveEls[_i2].setAttribute('data-bind-for-active', 'false');
        toRemoveEls[_i2].removeAttribute('data-bind-for-key');
        toRemoveEls[_i2].removeAttribute('data-bind-for-value');
        toRemoveEls[_i2].emit('bindfordeactivate', null, false);
        toRemoveEls[_i2].pause();
      }

      if (list.length) {
        this.renderItemsInPlace(list, activeKeys, 0);
      }
    };
  }(),

  /**
   * Add, takeover, or update item with delay support.
   */
  renderItemsInPlace: function renderItemsInPlace(list, activeKeys, i) {
    var _this2 = this;

    var data = this.data;
    var el = this.el;
    var itemEl;

    var item = list[i];
    var bindForKey = this.getBindForKey(item, i);
    var keyValue = data.key ? item[data.key].toString() : item.toString();

    // Add item.
    if (this.renderedKeys.indexOf(keyValue) === -1) {
      if (!el.querySelector(':scope > [data-bind-for-active="false"]')) {
        // No items available in pool. Generate new entity.
        var _itemEl = this.generateFromTemplate(item, i);
        _itemEl.addEventListener('loaded', function () {
          _itemEl.emit('bindforupdateinplace', item, false);
        });
        el.appendChild(_itemEl);
      } else {
        // Take over inactive item.
        itemEl = el.querySelector('[data-bind-for-active="false"]');
        itemEl.setAttribute('data-bind-for-key', bindForKey);
        itemEl.setAttribute('data-bind-for-value', keyValue);
        itemEl.object3D.visible = true;
        itemEl.play();
        itemEl.setAttribute('data-bind-for-active', 'true');
        itemEl.emit('bindforupdateinplace', item, false);
      }
      this.renderedKeys.push(keyValue);
    } else if (activeKeys.indexOf(keyValue) !== -1) {
      // Update item.
      if (list.length && list[0].constructor === String) {
        // Update index for simple list.
        itemEl = el.querySelector('[data-bind-for-value="' + keyValue + '"]');
        itemEl.setAttribute('data-bind-for-key', i);
      } else {
        itemEl = el.querySelector('[data-bind-for-key="' + bindForKey + '"]');
      }
      itemEl.emit('bindforupdateinplace', item, false);
    }

    if (!list[i + 1]) {
      return;
    }

    if (this.data.delay) {
      setTimeout(function () {
        _this2.renderItemsInPlace(list, activeKeys, i + 1);
      }, this.data.delay);
    } else {
      this.renderItemsInPlace(list, activeKeys, i + 1);
    }
  },

  /**
   * Generate entity from template.
   */
  generateFromTemplate: function generateFromTemplate(item, i) {
    var data = this.data;

    this.el.appendChild(this.system.renderTemplate(this.template, item));
    var newEl = this.el.children[this.el.children.length - 1];;

    // From pool.true
    if (!item) {
      newEl.setAttribute('data-bind-for-key', '');
      newEl.setAttribute('data-bind-for-active', 'false');
      return newEl;
    }

    var bindForKey = this.getBindForKey(item, i);
    newEl.setAttribute('data-bind-for-key', bindForKey);
    if (!data.key) {
      newEl.setAttribute('data-bind-for-value', item);
    }

    // Keep track of pooled and non-pooled entities if updating in place.
    newEl.setAttribute('data-bind-for-active', 'true');
    return newEl;
  },

  /**
   * Get entities marked for removal.
   *
   * @param {array} activeKeys - List of key values that should be active.
   * @param {array} renderedKeys - List of key values currently rendered.
   */
  getElsToRemove: function () {
    var toRemove = [];

    return function (activeKeys, renderedKeys) {
      var data = this.data;
      var el = this.el;

      toRemove.length = 0;
      for (var i = 0; i < el.children.length; i++) {
        if (el.children[i].tagName === 'TEMPLATE') {
          continue;
        }
        var key = data.key ? el.children[i].getAttribute('data-bind-for-key') : el.children[i].getAttribute('data-bind-for-value');
        if (activeKeys.indexOf(key) === -1 && renderedKeys.indexOf(key) !== -1) {
          toRemove.push(el.children[i]);
          renderedKeys.splice(renderedKeys.indexOf(key), 1);
        }
      }
      return toRemove;
    };
  }(),

  /**
   * Get value to use as the data-bind-for-key.
   * For items, will be value specified by `bind-for.key`.
   * For simple list, will be the index.
   */
  getBindForKey: function getBindForKey(item, i) {
    return this.data.key ? item[this.data.key].toString() : i.toString();
  },

  /**
   * Handle state update.
   */
  onStateUpdate: function onStateUpdate() {
    if (this.data.updateInPlace) {
      this.onStateUpdateInPlace();
    } else {
      this.onStateUpdateNaive();
    }
  }
});

/**
 * Handle parsing and update in-place updates under bind-for.
 */
AFRAME.registerComponent('bind-item', {
  schema: {
    type: 'string'
  },

  multiple: true,

  init: function init() {
    this.itemData = null;
    this.keysToWatch = [];
    this.prevValues = {};

    // Listen to root item for events.
    var rootEl = this.rootEl = this.el.closest('[data-bind-for-key]');
    if (!rootEl) {
      throw new Error('bind-item component must be attached to entity under a bind-for item.');
    }
    rootEl.addEventListener('bindforupdateinplace', this.updateInPlace.bind(this));
    rootEl.addEventListener('bindfordeactivate', this.deactivate.bind(this));

    this.el.sceneEl.systems.state.subscribe(this);
  },

  update: function update() {
    this.parseSelector();
  },

  /**
   * Run with bind-for tells to via event `bindforupdateinplace`, passing item data.
   */
  updateInPlace: function updateInPlace(evt) {
    var propertyMap = this.propertyMap;

    if (this.rootEl.getAttribute('data-bind-for-active') === 'false') {
      return;
    }

    if (evt) {
      this.itemData = evt.detail;
    }

    for (var property in propertyMap) {
      // Get value from item.
      var value = this.select(this.itemData, propertyMap[property]);

      // Diff against previous value.
      if (value === this.prevValues[property]) {
        continue;
      }

      // Update.
      AFRAME.utils.entity.setComponentProperty(this.el, property, value);

      this.prevValues[property] = value;
    }
  },

  onStateUpdate: function onStateUpdate() {
    this.updateInPlace();
  },

  select: function select(itemData, selector) {
    return lib.select(this.el.sceneEl.systems.state.state, selector, itemData);
  },

  deactivate: function deactivate() {
    this.prevValues = {};
  },

  parseSelector: function parseSelector() {
    var propertyMap = this.propertyMap = {};
    this.keysToWatch.length = 0;

    var componentName = lib.split(this.id, '__')[0];

    // Different parsing for multi-prop components.
    if (componentName in AFRAME.components && !AFRAME.components[componentName].isSingleProp) {
      var propertySplitList = lib.split(this.data, ';');
      for (var i = 0; i < propertySplitList.length; i++) {
        var propertySplit = lib.split(propertySplitList[i], ':');
        propertyMap[this.id + '.' + propertySplit[0].trim()] = propertySplit[1].trim();
        lib.parseKeysToWatch(this.keysToWatch, propertySplit[1].trim(), true);
      }
      return;
    }

    propertyMap[this.id] = this.data;
    lib.parseKeysToWatch(this.keysToWatch, this.data, true);
  }
});

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Computes the difference between two objects with ability to ignore keys.
 *
 * @param {object} a - First object to compare (e.g., oldData).
 * @param {object} b - Second object to compare (e.g., newData).
 * @returns {object}
 *   Difference object where set of keys note which values were not equal, and values are
 *   `b`'s values.
 */
module.exports = function () {
  var keys = [];

  return function (a, b, targetObject, ignoreKeys) {
    var aVal;
    var bVal;
    var bKey;
    var diff;
    var key;
    var i;
    var isComparingObjects;

    diff = targetObject || {};

    // Collect A keys.
    keys.length = 0;
    for (key in a) {
      keys.push(key);
    }

    if (!b) {
      return diff;
    }

    // Collect B keys.
    for (bKey in b) {
      if (keys.indexOf(bKey) === -1) {
        keys.push(bKey);
      }
    }

    for (i = 0; i < keys.length; i++) {
      key = keys[i];

      // Ignore specified keys.
      if (ignoreKeys && ignoreKeys.indexOf(key) !== -1) {
        continue;
      }

      aVal = a[key];
      bVal = b[key];
      isComparingObjects = aVal && bVal && aVal.constructor === Object && bVal.constructor === Object;
      if (isComparingObjects && !AFRAME.utils.deepEqual(aVal, bVal) || !isComparingObjects && aVal !== bVal) {
        diff[key] = bVal;
      }
    }
    return diff;
  };
}();

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var fns = ['push', 'pop', 'shift', 'unshift', 'splice'];

function wrapArray(arr) {
  var i;
  if (arr.__wrapped) {
    return;
  }
  for (i = 0; i < fns.length; i++) {
    makeCallDirty(arr, fns[i]);
  }
  arr.__wrapped = true;
}
module.exports.wrapArray = wrapArray;

function makeCallDirty(arr, fn) {
  var originalFn = arr[fn];
  arr[fn] = function () {
    originalFn.apply(arr, arguments);
    arr.__dirty = true;
  };
}

/***/ })
/******/ ]);
});

/***/ }),

/***/ "./js/components/crab-logic.js":
/*!*************************************!*\
  !*** ./js/components/crab-logic.js ***!
  \*************************************/
/***/ (() => {

AFRAME.registerComponent("crab-logic", {
  init: function init() {
    this.time = 0;
    this.randomInterval = Math.floor(Math.random() * Math.floor(2000)) + 2000;
    this.can_die = true;
    this.el.addEventListener("switch", function () {
      var visible = this.el.getAttribute("visible");
      this.el.setAttribute("visible", !visible);
    }.bind(this));
    this.el.addEventListener("candie", function () {
      this.can_die = true;
      console.log("clicked");
    }.bind(this));
    this.el.addEventListener("dontdie", function () {
      this.can_die = false;
    }.bind(this));

    var hammer_hit = function () {
      var crabs = document.getElementById("crab-container");
      var hit = document.getElementById("hit");

      if (this.can_die === true) {
        crabs.removeChild(this.el);
        AFRAME.scenes[0].emit("increaseScore", {
          points: 1
        });
        var hammer = document.getElementById("player-hammer");
        hammer.emit("rotate");
        hit.components.sound.playSound();
      }
    }.bind(this);

    this.el.addEventListener("mousedown", hammer_hit);
    this.el.addEventListener("click", hammer_hit);
  },
  tick: function tick(time, timeDelta) {
    this.time += timeDelta;

    if (this.time >= this.randomInterval) {
      this.el.emit("switch");
      this.time = 0;
    }
  }
});

/***/ }),

/***/ "./js/components/hammer-logic.js":
/*!***************************************!*\
  !*** ./js/components/hammer-logic.js ***!
  \***************************************/
/***/ (() => {

AFRAME.registerComponent("hammer-logic", {
  init: function init() {
    var crabs = [];
    this.el.addEventListener("crabs_spawned", function () {
      crabs = this.get_crabs();
    }.bind(this));
    this.el.addEventListener("animationstart", function () {
      crabs.map(function (crab) {
        crab.emit("dontdie");
      }.bind(this));
    });
    this.el.addEventListener("animationend", function () {
      crabs.map(function (crab) {
        crab.emit("candie");
      }.bind(this));
    });
  },
  get_crabs: function get_crabs() {
    crabs = Array.prototype.slice.call(document.querySelectorAll(".crab"));
    return crabs;
  }
}); // this.whackableMoles = Array.from(document.querySelectorAll('.mole'));

/***/ }),

/***/ "./js/components/timer-view.js":
/*!*************************************!*\
  !*** ./js/components/timer-view.js ***!
  \*************************************/
/***/ (() => {

AFRAME.registerComponent("timer-view", {
  init: function init() {
    this.el.setAttribute("text", "value", "hello world");
  },
  tick: function tick(time, timeDelta) {
    var world = document.querySelector("a-scene");

    var _world$getAttribute = world.getAttribute("world"),
        gametime = _world$getAttribute.gametime,
        timer_ongoing = _world$getAttribute.timer_ongoing;

    var pretty_time = Math.ceil(gametime / 1000);

    if (timer_ongoing) {
      this.el.setAttribute("text", "value", pretty_time);
    } else {
      this.el.setAttribute("text", "value", "Time ended");
    }
  }
});

/***/ }),

/***/ "./js/components/world.js":
/*!********************************!*\
  !*** ./js/components/world.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _crabs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../crabs */ "./js/crabs.js");
/* harmony import */ var _holes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../holes */ "./js/holes.js");


AFRAME.registerComponent("world", {
  schema: {
    gametime: {
      type: "float",
      "default": 0.0
    },
    timer_ongoing: {
      type: "boolean",
      "default": true
    }
  },
  init: function init() {
    this.time = 0;
    console.log(); // game lasts 1 0 second

    this.el.setAttribute("world", "gametime", 10.0 * 1000); // start the timer

    this.el.setAttribute("world", "timer_ongoing,", true); // add game reset listener

    this.el.addEventListener("mousedown", this.reset_game.bind(this));
    this.spawn_crabs();
  },
  start_game: function start_game() {},
  spawn_crabs: function spawn_crabs() {
    var crabs = document.getElementById("crab-container");
    _holes__WEBPACK_IMPORTED_MODULE_1__.holePositions.map(function (position) {
      var crab = (0,_crabs__WEBPACK_IMPORTED_MODULE_0__.create_yabbi)(position);
      crabs.appendChild(crab);
    });
    var hammer = document.getElementById("player-hammer");
    hammer.emit("crabs_spawned");
  },
  kill_all_crabs: function kill_all_crabs() {
    var crab_container = document.getElementById("crab-container");
    var crabs = document.querySelectorAll(".crab");
    crabs.forEach(function (crab) {
      crab_container.removeChild(crab);
    });
  },
  reset_game: function reset_game() {
    var _this$el$getAttribute = this.el.getAttribute("world"),
        timer_ongoing = _this$el$getAttribute.timer_ongoing;

    if (timer_ongoing === false) {
      // kill the crabs
      this.kill_all_crabs(); //   reset score

      AFRAME.scenes[0].emit("resetScore", {}); // reset timer
      // game lasts 1 0 seconds

      this.el.setAttribute("world", "gametime", 10.0 * 1000); // start the timer

      this.el.setAttribute("world", "timer_ongoing", true);
    }
  },
  show_win_text: function show_win_text() {
    var win_text = document.getElementById("winning-text");
    var visible = win_text.getAttribute("visible");

    if (visible === false) {
      win_text.setAttribute("visible", true);
    }
  },
  hide_win_text: function hide_win_text() {
    var win_text = document.getElementById("winning-text");
    var visible = win_text.getAttribute("visible");

    if (visible === true) {
      win_text.setAttribute("visible", false);
    }
  },
  tick: function tick(time, timeDelta) {
    var crabs = document.querySelectorAll(".crab"); // decrement the game timer

    var _this$el$getAttribute2 = this.el.getAttribute("world"),
        gametime = _this$el$getAttribute2.gametime,
        timer_ongoing = _this$el$getAttribute2.timer_ongoing;

    var updated_gametime = gametime - timeDelta;

    if (timer_ongoing) {
      if (Math.ceil(updated_gametime / 1000) >= 0) {
        this.el.setAttribute("world", "gametime", updated_gametime);
      } else {
        this.el.setAttribute("world", "timer_ongoing", false);
      }
    }

    if (crabs.length <= 0 && timer_ongoing) {
      this.time += timeDelta;

      if (this.time >= 1000) {
        this.time = 0;
        this.spawn_crabs();
      }
    }

    if (timer_ongoing === true) {
      this.hide_win_text();
    }

    if (timer_ongoing === false) {
      this.kill_all_crabs();
      this.show_win_text();
    }
  }
});

/***/ }),

/***/ "./js/crabs.js":
/*!*********************!*\
  !*** ./js/crabs.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "create_yabbi": () => (/* binding */ create_yabbi)
/* harmony export */ });
var create_yabbi = function create_yabbi(position) {
  var yabbi = document.createElement("a-entity");
  yabbi.setAttribute("mixin", "crab");
  yabbi.setAttribute("position", position);
  yabbi.setAttribute("scale", {
    x: 0.3,
    y: 0.3,
    z: 0.3
  });
  yabbi.setAttribute("rotation", {
    x: 180,
    y: 0,
    z: 180
  });
  yabbi.classList.add("crab");
  return yabbi;
};

/***/ }),

/***/ "./js/holes.js":
/*!*********************!*\
  !*** ./js/holes.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createPosition": () => (/* binding */ createPosition),
/* harmony export */   "holePositions": () => (/* binding */ holePositions)
/* harmony export */ });
var createPosition = function createPosition(x, y, z) {
  return {
    x: x,
    y: y,
    z: z
  };
};
var holePositions = [createPosition(1, 0, 0.5), createPosition(0, 0, 0.5), createPosition(-1, 0, 0.5), createPosition(-1, 0, -0.5), createPosition(0, 0, -0.5), createPosition(1, 0, -0.5)];

/***/ }),

/***/ "./js/state.js":
/*!*********************!*\
  !*** ./js/state.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe_state_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe-state-component */ "./node_modules/aframe-state-component/dist/aframe-state-component.js");
/* harmony import */ var aframe_state_component__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe_state_component__WEBPACK_IMPORTED_MODULE_0__);

AFRAME.registerState({
  initialState: {
    score: 0
  },
  handlers: {
    decreaseScore: function decreaseScore(state, action) {
      state.score -= action.points;
    },
    increaseScore: function increaseScore(state, action) {
      state.score += action.points;
    },
    resetScore: function resetScore(state, action) {
      state.score = 0;
    }
  }
});

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!********************!*\
  !*** ./js/main.js ***!
  \********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_hammer_logic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/hammer-logic */ "./js/components/hammer-logic.js");
/* harmony import */ var _components_hammer_logic__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_components_hammer_logic__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./state */ "./js/state.js");
/* harmony import */ var _components_world__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/world */ "./js/components/world.js");
/* harmony import */ var _components_crab_logic__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/crab-logic */ "./js/components/crab-logic.js");
/* harmony import */ var _components_crab_logic__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_components_crab_logic__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _components_timer_view__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/timer-view */ "./js/components/timer-view.js");
/* harmony import */ var _components_timer_view__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_components_timer_view__WEBPACK_IMPORTED_MODULE_4__);
// hammer-logic component
 // state handler

 // world component

 // crab logic

 // timer view


})();

/******/ })()
;
//# sourceMappingURL=main.bundle.js.map