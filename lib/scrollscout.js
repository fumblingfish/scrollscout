(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("scrollscout", [], factory);
	else if(typeof exports === 'object')
		exports["scrollscout"] = factory();
	else
		root["scrollscout"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _observer = __webpack_require__(1);
	
	var _observer2 = _interopRequireDefault(_observer);
	
	var _scout = __webpack_require__(2);
	
	var _scout2 = _interopRequireDefault(_scout);
	
	var _contextDom = __webpack_require__(9);
	
	var _contextDom2 = _interopRequireDefault(_contextDom);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var defaultOptions = {
	   runInitialUpdate: true,
	   context: typeof window !== 'undefined' ? _contextDom2.default : Function.prototype
	};
	
	var create = function create(view, scene, options) {
	   var optns = Object.assign(defaultOptions, options);
	   return (0, _scout2.default)((0, _observer2.default)(), view, scene, optns);
	};
	
	module.exports = { create: create };

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	function observer() {
	   var listeners = [],
	       UID = 0;
	
	   var removeEventListener = function removeEventListener(id) {
	      listeners = listeners.filter(function (listener) {
	         return listener.id !== id;
	      });
	      return id;
	   };
	
	   return {
	      addListener: function addListener(type, callback) {
	         UID += 1;
	         var event = { id: UID, type: type, callback: callback };
	         listeners.push(event);
	         var fn = function fn() {
	            removeEventListener(event.id);
	            return event;
	         };
	         fn._id = event.id;
	         return fn;
	      },
	      removeListener: function removeListener(removeListenerFn) {
	         return removeListenerFn();
	      },
	      removeListenerById: function removeListenerById(id) {
	         return removeEventListener(id);
	      },
	      removeAllListeners: function removeAllListeners() {
	         listeners = [];
	      },
	      getListeners: function getListeners() {
	         return listeners;
	      },
	      notifyListeners: function notifyListeners(type, evt) {
	         listeners.forEach(function (listener) {
	            if (listener.type === type) {
	               listener.callback(evt);
	            }
	         });
	      },
	      uniqueTypesSubscribed: function uniqueTypesSubscribed() {
	         var types = listeners.map(function (e) {
	            return e.type;
	         });
	         return types.reduce(function (acc, next) {
	            if (acc.indexOf(next) !== -1) return acc;
	            acc.push(next);
	            return acc;
	         }, []);
	      }
	   };
	}
	
	exports.default = observer;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.passedTargetPoint = exports.anonymousAxisPair = exports.someAxis = exports.targetPointPair = exports.targetPoint = undefined;
	exports.default = scout;
	
	var _pin = __webpack_require__(3);
	
	var _pin2 = _interopRequireDefault(_pin);
	
	var _createState = __webpack_require__(7);
	
	var _createState2 = _interopRequireDefault(_createState);
	
	var _common = __webpack_require__(5);
	
	var _constants = __webpack_require__(6);
	
	var _predicates = __webpack_require__(8);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var targetPoint = exports.targetPoint = function targetPoint(a1, a2, p, o) {
	   return a1 + a2 * p + o;
	};
	
	var targetPointPair = exports.targetPointPair = function targetPointPair(stateView, stateScene, pin) {
	   return [targetPoint(stateView[0], stateView[1], pin._view.position, pin._view.offset), targetPoint(stateScene[0], stateScene[1], pin._scene.position, pin._scene.offset)];
	};
	
	var someAxis = exports.someAxis = function someAxis(axis) {
	   return function (listeners, pins) {
	      return listeners.some(function (listener) {
	         return pins[listener.type]._axis === axis;
	      });
	   };
	};
	
	var anonymousAxisPair = exports.anonymousAxisPair = function anonymousAxisPair(axis, viewState, sceneState) {
	   return axis === _constants.AXIS_Y ? [[viewState.y1, viewState.y2], [sceneState.y1, sceneState.y2]] : [[viewState.x1, viewState.x2], [sceneState.x1, sceneState.x2]];
	};
	
	var passedTargetPoint = exports.passedTargetPoint = function passedTargetPoint(pState, nState) {
	   return function (pin) {
	      var predicate = _predicates.directionPredicates[pin._direction];
	      var prevStatePair = anonymousAxisPair(pin._axis, pState.view, pState.scene);
	      var nextStatePair = anonymousAxisPair(pin._axis, nState.view, nState.scene);
	      var pT = targetPointPair(prevStatePair[0], prevStatePair[1], pin);
	      var nT = targetPointPair(nextStatePair[0], nextStatePair[1], pin);
	      return predicate(pT[0], pT[1], nT[0], nT[1]);
	   };
	};
	
	var someAxisX = someAxis(_constants.AXIS_X);
	var someAxisY = someAxis(_constants.AXIS_Y);
	
	function scout(obsvr, view, scene, optns) {
	
	   var observer = obsvr,
	       options = optns,
	       contextEnv = options.context(view, scene),
	       pins = {},
	       pinSubscribers = [],
	       prevState,
	       feedY = false,
	       feedX = false,
	       shouldRefreshBeforeUpdate = true,
	       initialized = false,
	       cachedUpdate,
	       debugging = false,
	       contextDebugger;
	
	   var pinChanges = function pinChanges() {
	      shouldRefreshBeforeUpdate = true;
	   };
	
	   var addListener = function addListener(pinName, fn) {
	      shouldRefreshBeforeUpdate = true;
	      return observer.addListener(pinName, fn);
	   };
	
	   var removeListener = function removeListener(fn) {
	      return observer.removeListener(fn);
	   };
	
	   var removeAllListeners = function removeAllListeners(fn) {
	      return observer.removeAllListeners(fn);
	   };
	
	   var getListeners = function getListeners() {
	      return observer.getListeners();
	   };
	
	   var notifyListeners = function notifyListeners(pinName, evt) {
	      return observer.notifyListeners(pinName, evt);
	   };
	
	   var addPin = function addPin(pinName) {
	      if (pins[pinName]) return false;
	      var pin = new _pin2.default(pinName, _scoutInternal);
	      pins[pinName] = pin;
	      return pin;
	   };
	
	   var removePin = function removePin(pinName) {
	      var listeners = observer.getListeners();
	      var listenersWithPinName = listeners.filter(function (lnr) {
	         return lnr.type === pinName;
	      });
	      listenersWithPinName.forEach(function (lsnr) {
	         observer.removeListenerById(lsnr.id);
	      });
	      return delete pins[pinName];
	   };
	
	   var getPin = function getPin(pinName) {
	      return pins[pinName];
	   };
	
	   var isDebugging = function isDebugging() {
	      return debugging;
	   };
	
	   var debug = function debug(value) {
	      if (value === false) {
	         Object.keys(pins).forEach(function (key) {
	            pins[key].debug(false);
	         });
	      } else {
	         Object.keys(pins).forEach(function (key) {
	            pins[key].debug(true);
	         });
	      }
	   };
	
	   var initialize = function initialize() {
	      prevState = (0, _createState.createInitialState)(contextEnv, feedX, feedY);
	      initialized = true;
	   };
	
	   var refreshProps = function refreshProps() {
	      var _this = this,
	          _arguments = arguments;
	
	      var listeners = observer.getListeners();
	      var types = listeners.map(function (l) {
	         return l.type;
	      });
	      var uniqueSubscribers = types.filter((0, _common.unique)(types));
	
	      //refresh
	      pinSubscribers = (0, _common.filterOverKeyValue)(pins, uniqueSubscribers);
	      feedX = someAxisX(listeners, pins);
	      feedY = someAxisY(listeners, pins);
	      shouldRefreshBeforeUpdate = false;
	
	      var pinsToDebug = pinSubscribers.filter(function (pin) {
	         return pin._debug;
	      });
	
	      if (pinsToDebug.length > 0) {
	         debugging = true;
	         if (contextDebugger) {
	            contextDebugger.clearPins();
	         }
	         contextDebugger = contextEnv.debug(view, scene, pinsToDebug);
	         if (!initialized) {
	            // make sure prevState exits before adding debug marks
	            initialize();
	         }
	
	         cachedUpdate = !cachedUpdate ? updateScout : cachedUpdate;
	         updateScout = function updateScout() {
	            cachedUpdate.apply(_this, _arguments);
	            // after cachedUpdate prevState is updated
	            contextDebugger.update(prevState);
	         };
	         updateScout();
	      } else if (debugging) {
	         debugging = false;
	         contextDebugger.clearAll();
	         updateScout = cachedUpdate;
	         cachedUpdate = null;
	      }
	   };
	
	   var updateScout = function updateScout() {
	
	      if (shouldRefreshBeforeUpdate) {
	         refreshProps();
	      }
	      if (!initialized) {
	         initialize();
	      }
	
	      var nextState = (0, _createState2.default)(contextEnv, feedX, feedY);
	      var pinsToNotify = pinSubscribers.filter(passedTargetPoint(prevState, nextState));
	
	      pinsToNotify.forEach(function (pin) {
	         notifyListeners(pin._name, {});
	      });
	
	      prevState = nextState;
	   };
	
	   var update = function update() {
	      updateScout();
	   };
	
	   if (options.runInitialUpdate) {
	      if (typeof window !== 'undefined' && window.requestAnimationFrame) {
	         window.requestAnimationFrame(updateScout);
	      }
	   }
	
	   var _scoutInternal = {
	      addListener: addListener,
	      removePin: removePin,
	      pinChanges: pinChanges
	   };
	
	   return {
	      addPin: addPin,
	      addListener: addListener,
	      removeListener: removeListener,
	      removeAllListeners: removeAllListeners,
	      getListeners: getListeners,
	      notifyListeners: notifyListeners,
	      update: update,
	      getPin: getPin,
	      removePin: removePin,
	      isDebugging: isDebugging,
	      debug: debug
	   };
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _pinbase = __webpack_require__(4);
	
	var _pinbase2 = _interopRequireDefault(_pinbase);
	
	var _constants = __webpack_require__(6);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Pin = function (_PinBase) {
	   _inherits(Pin, _PinBase);
	
	   function Pin(name, scoutRef) {
	      var _ret;
	
	      _classCallCheck(this, Pin);
	
	      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Pin).call(this));
	
	      _this._name = name;
	      _this._direction = _constants.DESCEND;
	      _this._axis = _constants.AXIS_Y;
	      _this._debug = false;
	      _this._pinChanges = scoutRef.pinChanges;
	      _this.subscribe = function (fn) {
	         return scoutRef.addListener(_this._name, fn);
	      };
	      _this.destroy = function () {
	         return scoutRef.removePin(_this._name);
	      };
	      return _ret = _this, _possibleConstructorReturn(_this, _ret);
	   }
	
	   _createClass(Pin, [{
	      key: 'descend',
	      value: function descend() {
	         this._direction = _constants.DESCEND;
	         this._pinChanges();
	         return this;
	      }
	   }, {
	      key: 'ascend',
	      value: function ascend() {
	         this._direction = _constants.ASCEND;
	         this._pinChanges();
	         return this;
	      }
	   }, {
	      key: 'view',
	      value: function view(value, offset) {
	         _get(Object.getPrototypeOf(Pin.prototype), 'view', this).call(this, value, offset);
	         this._pinChanges();
	         return this;
	      }
	   }, {
	      key: 'scene',
	      value: function scene(value, offset) {
	         _get(Object.getPrototypeOf(Pin.prototype), 'scene', this).call(this, value, offset);
	         this._pinChanges();
	         return this;
	      }
	   }, {
	      key: 'axis',
	      value: function axis(_axis) {
	         this._axis = _axis === _constants.AXIS_X ? _constants.AXIS_X : _constants.AXIS_Y;
	         this._pinChanges();
	         return this;
	      }
	   }, {
	      key: 'debug',
	      value: function debug(value) {
	         this._debug = typeof value === 'undefined' || value !== false;
	         this._debugColor = typeof value !== 'undefined' && value !== false && value !== true ? value : undefined;
	         this._pinChanges();
	         return this;
	      }
	   }]);
	
	   return Pin;
	}(_pinbase2.default);
	
	exports.default = Pin;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _common = __webpack_require__(5);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var parseOffset = function parseOffset(offset) {
	   if (offset == null) return 0;
	   return (0, _common.isString)(offset) ? parseFloat(offset.match(/[-+0-9]+/g)) : parseFloat(offset);
	};
	
	var PinBase = function () {
	   function PinBase() {
	      _classCallCheck(this, PinBase);
	
	      this._view = {
	         position: 0.5,
	         offset: 0
	      };
	      this._scene = {
	         position: 0.5,
	         offset: 0
	      };
	   }
	
	   _createClass(PinBase, [{
	      key: 'view',
	      value: function view(value, offset) {
	         this._view.position = (0, _common.isNumber)(value) ? value : this._view.position;
	         this._view.offset = parseOffset(offset);
	         return this;
	      }
	   }, {
	      key: 'scene',
	      value: function scene(value, offset) {
	         this._scene.position = (0, _common.isNumber)(value) ? value : this._scene.position;
	         this._scene.offset = parseOffset(offset);
	         return this;
	      }
	   }]);
	
	   return PinBase;
	}();
	
	exports.default = PinBase;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	var filterOverKeyValue = exports.filterOverKeyValue = function filterOverKeyValue(obj, arr) {
	   return arr.reduce(function (acc, key) {
	      if (!obj[key]) return acc;
	      return [].concat(acc, [obj[key]]);
	   }, []);
	};
	
	var unique = exports.unique = function unique(list) {
	   return function (value, index) {
	      return list.indexOf(value) === index;
	   };
	};
	
	var any = exports.any = function any(fn, arr) {
	   return arr.reduce(function (acc, next) {
	      if (acc === true) return;
	      return fn(next);
	   }, false);
	};
	
	var isNumber = exports.isNumber = function isNumber(obj) {
	   return Object.prototype.toString.call(obj) == '[object Number]';
	};
	var isString = exports.isString = function isString(obj) {
	   return Object.prototype.toString.call(obj) == '[object String]';
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var DESCEND = exports.DESCEND = 'descend';
	var ASCEND = exports.ASCEND = 'ascend';
	var AXIS_X = exports.AXIS_X = 'x';
	var AXIS_Y = exports.AXIS_Y = 'y';

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	
	exports.default = function (context, calcX, calcY) {
	   var view = {},
	       scene = {};
	   var contextView = context.view;
	   var contextScene = context.scene;
	   if (calcX) {
	      view.x1 = contextView.left();
	      view.x2 = contextView.width();
	      scene.x1 = contextScene.left();
	      scene.x2 = contextScene.width();
	   }
	   if (calcY) {
	      view.y1 = contextView.top();
	      view.y2 = contextView.height();
	      scene.y1 = contextScene.top();
	      scene.y2 = contextScene.height();
	   }
	   return { view: view, scene: scene };
	};
	
	var createInitialState = exports.createInitialState = function createInitialState(context, calcX, calcY) {
	   var view = {},
	       scene = {};
	   var contextScene = context.scene;
	   if (calcX) {
	      view.x1 = 0;
	      view.x2 = 0;
	      scene.x1 = contextScene.left();
	      scene.x2 = contextScene.width();
	   }
	   if (calcY) {
	      view.y1 = 0;
	      view.y2 = 0;
	      scene.y1 = contextScene.top();
	      scene.y2 = contextScene.height();
	   }
	   return { view: view, scene: scene };
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.directionPredicates = exports.nextAscendPrev = exports.nextDescendPrev = undefined;
	
	var _directionPredicates;
	
	var _constants = __webpack_require__(6);
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	var nextDescendPrev = exports.nextDescendPrev = function nextDescendPrev(pv, ps, nv, ns) {
	   return pv < ps && nv >= ns;
	};
	var nextAscendPrev = exports.nextAscendPrev = function nextAscendPrev(pv, ps, nv, ns) {
	   return pv > ps && nv <= ns;
	};
	
	var directionPredicates = exports.directionPredicates = (_directionPredicates = {}, _defineProperty(_directionPredicates, _constants.DESCEND, nextDescendPrev), _defineProperty(_directionPredicates, _constants.ASCEND, nextAscendPrev), _directionPredicates);

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	
	exports.default = function (viewElement, sceneElement) {
	   var contextView = Function.prototype;
	   if (typeof window !== 'undefined') {
	      if (!(sceneElement instanceof HTMLElement)) {
	         throw new Error('element must be a of type HTMLElement', sceneElement);
	      }
	      if (viewElement === window || viewElement === 'window') {
	         contextView = contextWindow;
	      } else if (viewElement instanceof HTMLElement) {
	         contextView = contextViewElement;
	      }
	   }
	   return {
	      view: contextView(viewElement),
	      scene: contextSceneElement(sceneElement),
	      debug: _contextDomDebug.contextDebug,
	      debugUpdate: _contextDomDebug.contextDebugUpdate
	   };
	};
	
	var _contextDomDebug = __webpack_require__(11);
	
	var contextWindow = function contextWindow(window) {
	   return {
	      top: function top() {
	         var doc = document.documentElement;
	         return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
	      },
	      left: function left() {
	         var doc = document.documentElement;
	         return (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
	      },
	      width: function width() {
	         return window.innerWidth;
	      },
	      height: function height() {
	         return window.innerHeight;
	      }
	   };
	};
	
	var contextViewElement = function contextViewElement(element) {
	   return {
	      top: function top() {
	         return element.scrollTop;
	      },
	      left: function left() {
	         return element.scrollLeft;
	      },
	      width: function width() {
	         return element.offsetWidth;
	      },
	      height: function height() {
	         return element.offsetHeight;
	      }
	   };
	};
	
	var contextSceneElement = function contextSceneElement(element) {
	   return {
	      top: function top() {
	         return element.offsetTop;
	      },
	      left: function left() {
	         return element.offsetLeft;
	      },
	      width: function width() {
	         return element.offsetWidth;
	      },
	      height: function height() {
	         return element.offsetHeight;
	      }
	   };
	};

/***/ },
/* 10 */,
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.contextDebug = undefined;
	
	var _constants = __webpack_require__(6);
	
	var _scout = __webpack_require__(2);
	
	var colors = ['deeppink', 'lime', 'cyan', 'purple', 'yellow', 'fuchsia'];
	var colorIndex = 0;
	
	var UID = 0;
	
	var uid = function uid() {
	   return UID++;
	};
	
	var propMap = {
	   x: {
	      orientation: 'left',
	      sides: ['bottom', 'top'],
	      size: ['width', 'height'],
	      arrowChar: ['&#x21e2;', '&#x21e0;'],
	      translate: ['translateX', 'translateY']
	   },
	   y: {
	      orientation: 'top',
	      sides: ['right', 'left'],
	      size: ['height', 'width'],
	      arrowChar: ['&#x21e3;', '&#x21e1;'],
	      translate: ['translateY', 'translateX']
	   }
	};
	
	var translate = function translate(axis, value) {
	   return axis + '(' + value + 'px)';
	};
	
	var createMarker = function createMarker(targetType, pin) {
	
	   var axisStyle = propMap[pin._axis];
	   var dir = pin._direction === _constants.ASCEND ? 1 : 0;
	
	   var marker = document.createElement('div');
	   var line = document.createElement('div');
	   var title = document.createElement('div');
	   var dirPointer = document.createElement('div');
	   var markerName = document.createTextNode(pin._name);
	
	   title.appendChild(markerName);
	   marker.appendChild(dirPointer);
	   marker.appendChild(line);
	   marker.appendChild(title);
	
	   dirPointer.style.fontSize = '20px';
	   dirPointer.style.position = 'absolute';
	   dirPointer.style[axisStyle.orientation] = '-22px';
	   dirPointer.style[axisStyle.sides[dir]] = '20px';
	   dirPointer.style.width = '22px';
	   dirPointer.style.height = '22px';
	   dirPointer.style.textAlign = 'center';
	
	   line.style.position = 'absolute';
	   line.style.background = pin._debugColor;
	   line.style[axisStyle.sides[dir]] = '0px';
	   line.style[axisStyle.size[0]] = '1px';
	   line.style[axisStyle.size[1]] = '80px';
	
	   title.style.position = 'absolute';
	   title.style[axisStyle.orientation] = '5px';
	
	   marker.style[axisStyle.orientation] = 0;
	   marker.style.cssText = 'position:fixed; font-family:consolas, monospace; font-size:10px;';
	   marker.style.zIndex = 100000;
	   marker.style.color = pin._debugColor;
	   marker.id = '__pin__' + targetType + '__' + pin._name;
	   marker.style.pointerEvents = 'none';
	
	   return { marker: marker, line: line, title: title, dirPointer: dirPointer };
	};
	
	var styleMarkerView = function styleMarkerView(markObj, pin) {
	   var marker = markObj.marker;
	   var title = markObj.title;
	   var dirPointer = markObj.dirPointer;
	
	   var axisStyle = propMap[pin._axis];
	   var dir = pin._direction === _constants.ASCEND ? 1 : 0;
	   marker.style[axisStyle.sides[dir]] = '0px';
	   title.style[axisStyle.sides[dir]] = '5px';
	   dirPointer.innerHTML = axisStyle.arrowChar[dir];
	   dirPointer.style[axisStyle.sides[dir]] = '60px';
	   return markObj.marker;
	};
	
	var styleMarkerScene = function styleMarkerScene(markObj, pin) {
	   var marker = markObj.marker;
	   var line = markObj.line;
	   var title = markObj.title;
	   var dirPointer = markObj.dirPointer;
	
	   var axisStyle = propMap[pin._axis];
	   var dir = pin._direction === _constants.ASCEND ? 1 : 0;
	   var dirInv = dir ? 0 : 1;
	   marker.style[axisStyle.sides[dir]] = '40px';
	   line.style.background = pin._debugColor;
	   line.style[axisStyle.size[1]] = '40px';
	   title.style[axisStyle.sides[dir]] = '0px';
	   dirPointer.innerHTML = axisStyle.arrowChar[dirInv];
	   return markObj.marker;
	};
	
	var createDebugContainer = function createDebugContainer() {
	   var debugContainer = document.createElement('div');
	   debugContainer.id = '__scrollscout_debug__container_' + uid();
	   debugContainer.style.position = 'fixed';
	   debugContainer.style.zIndex = 9999999;
	   debugContainer.style.pointerEvents = 'none';
	   return debugContainer;
	};
	
	var px = function px(value) {
	   return value + 'px';
	};
	
	var colorPin = function colorPin(pin) {
	   pin._debugColor = pin._debugColor ? pin._debugColor : colors[colorIndex++];
	   colorIndex = colorIndex === colors.length ? 0 : colorIndex;
	   return pin;
	};
	
	var contextDebug = exports.contextDebug = function contextDebug(viewElement, sceneElement, pins) {
	   var contextDom = this,
	       isViewWindow = viewElement === window;
	
	   var debugContainer = createDebugContainer();
	
	   if (isViewWindow) {
	      debugContainer.style.top = '0px';
	      debugContainer.style.left = '0px';
	      debugContainer.style.right = '0px';
	      debugContainer.style.bottom = '0px';
	   }
	   pins.forEach(function (pin) {
	      colorPin(pin);
	      var markerView = createMarker('view', pin);
	      var markerScene = createMarker('scene', pin);
	      pin.__debugViewMarker = styleMarkerView(markerView, pin);
	      pin.__debugSceneMarker = styleMarkerScene(markerScene, pin);
	      debugContainer.appendChild(pin.__debugViewMarker);
	      debugContainer.appendChild(pin.__debugSceneMarker);
	      if (!isViewWindow) {
	         pin.__debugViewMarker.style.position = 'absolute';
	         pin.__debugSceneMarker.style.position = 'absolute';
	      }
	   });
	   document.body.appendChild(debugContainer);
	   return {
	      update: function update(nState) {
	         pins.forEach(function (pin) {
	
	            var axisStyle = propMap[pin._axis];
	            var nextStatePair = (0, _scout.anonymousAxisPair)(pin._axis, nState.view, nState.scene);
	            var nT = (0, _scout.targetPointPair)(nextStatePair[0], nextStatePair[1], pin);
	
	            if (isViewWindow) {
	               var viewSize = contextDom.view[axisStyle.size[0]]();
	               var viewPos = contextDom.view[axisStyle.orientation]();
	               var positionView = (0, _scout.targetPoint)(0, viewSize, pin._view.position, pin._view.offset);
	               pin.__debugViewMarker.style.transform = translate(axisStyle.translate[0], positionView);
	               pin.__debugSceneMarker.style.transform = translate(axisStyle.translate[0], nT[1] - viewPos);
	            } else {
	               var _viewSize = contextDom.view[axisStyle.size[0]]();
	               var _viewPos = contextDom.view[axisStyle.orientation]();
	               var _positionView = (0, _scout.targetPoint)(0, _viewSize, pin._view.position, pin._view.offset);
	
	               pin.__debugViewMarker.style[axisStyle.orientation] = _positionView + 'px';
	               pin.__debugSceneMarker.style[axisStyle.orientation] = nT[1] - _viewPos + 'px';
	
	               debugContainer.style.top = px(viewElement.getBoundingClientRect().top);
	               debugContainer.style.left = px(viewElement.getBoundingClientRect().left);
	               debugContainer.style.width = px(contextDom.view.width());
	               debugContainer.style.height = px(contextDom.view.height());
	            }
	         });
	      },
	      clearPins: function clearPins() {
	         while (debugContainer.firstChild) {
	            debugContainer.removeChild(debugContainer.firstChild);
	         }
	         colorIndex = 0;
	      },
	      clearAll: function clearAll() {
	         document.body.removeChild(debugContainer);
	      }
	   };
	};

/***/ }
/******/ ])
});
;
//# sourceMappingURL=scrollscout.js.map