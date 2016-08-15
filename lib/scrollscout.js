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
	
	var defaultContext = Function.prototype;
	
	if (typeof window !== 'undefined') {
	   defaultContext = _contextDom2.default;
	}
	
	var create = function create(scene, options, userContext) {
	   var context = userContext ? userContext : defaultContext;
	   return (0, _scout2.default)((0, _observer2.default)(), options, context(scene));
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
	       GUI = 0;
	
	   var removeEventListener = function removeEventListener(id) {
	      listeners = listeners.filter(function (listener) {
	         return listener.id !== id;
	      });
	      return id;
	   };
	
	   return {
	      addListener: function addListener(type, callback) {
	         GUI += 1;
	         var event = { id: GUI, type: type, callback: callback };
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
	exports.someAxis = exports.targetPointPair = exports.targetPoint = undefined;
	exports.default = scout;
	
	var _pin = __webpack_require__(3);
	
	var _pin2 = _interopRequireDefault(_pin);
	
	var _createState = __webpack_require__(7);
	
	var _createState2 = _interopRequireDefault(_createState);
	
	var _common = __webpack_require__(5);
	
	var _constants = __webpack_require__(6);
	
	var _predicates = __webpack_require__(8);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var defaultOptions = {
	   runInitialUpdate: true
	};
	
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
	
	var someAxisX = someAxis(_constants.AXIS_X);
	var someAxisY = someAxis(_constants.AXIS_Y);
	
	function scout(obs, opt, inpEnv) {
	
	   var observer = obs,
	       options = Object.assign(defaultOptions, opt),
	       inputEnv = inpEnv,
	       pins = {},
	       pinSubscribers = [],
	       prevState,
	       feedY = false,
	       feedX = false,
	       shouldRefreshBeforeUpdate = true,
	       initialized = false;
	
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
	
	      //Todo: must be unique and must be string
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
	
	   var initialize = function initialize() {
	      prevState = (0, _createState.createInitialState)(inputEnv, feedX, feedY);
	      initialized = true;
	   };
	
	   var refreshProps = function refreshProps() {
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
	   };
	
	   var anonymousAxisPair = function anonymousAxisPair(axis, viewState, sceneState) {
	      return axis === _constants.AXIS_Y ? [[viewState.y1, viewState.y2], [sceneState.y1, sceneState.y2]] : [[viewState.x1, viewState.x2], [sceneState.x1, sceneState.x2]];
	   };
	
	   var update = function update(fn) {
	      if (shouldRefreshBeforeUpdate) {
	         refreshProps();
	      }
	      if (!initialized) {
	         initialize();
	      }
	      var nextState = (0, _createState2.default)(inputEnv, feedX, feedY);
	      pinSubscribers.forEach(function (pin) {
	         var predicate = _predicates.directionPredicates[pin._direction];
	         var prevStatePair = anonymousAxisPair(pin._axis, prevState.view, prevState.scene);
	         var nextStatePair = anonymousAxisPair(pin._axis, nextState.view, nextState.scene);
	         var pT = targetPointPair(prevStatePair[0], prevStatePair[1], pin);
	         var nT = targetPointPair(nextStatePair[0], nextStatePair[1], pin);
	         var passed = predicate(pT[0], pT[1], nT[0], nT[1]);
	         if (passed) notifyListeners(pin._name, {});
	      });
	      prevState = nextState;
	   };
	
	   var getPin = function getPin(pinName) {
	      return pins[pinName];
	   };
	
	   if (options.runInitialUpdate) {
	      if (typeof window !== 'undefined' && window.requestAnimationFrame) {
	         window.requestAnimationFrame(update);
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
	      removePin: removePin
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
	      _this.subscribe = function (fn) {
	         return scoutRef.addListener(_this._name, fn);
	      };
	      _this.destroy = function () {
	         return scoutRef.removePin(_this._name);
	      };
	      _this.pinChanges = scoutRef.pinChanges;
	      return _ret = _this, _possibleConstructorReturn(_this, _ret);
	   }
	
	   _createClass(Pin, [{
	      key: 'descend',
	      value: function descend() {
	         this._direction = _constants.DESCEND;
	         return this;
	      }
	   }, {
	      key: 'ascend',
	      value: function ascend() {
	         this._direction = _constants.ASCEND;
	         return this;
	      }
	   }, {
	      key: 'axis',
	      value: function axis(_axis) {
	         this._axis = _axis === _constants.AXIS_X ? _constants.AXIS_X : _constants.AXIS_Y;
	         this.pinChanges();
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
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	
	exports.default = function (element) {
	
	   if (typeof window !== 'undefined' && !(element instanceof HTMLElement)) {
	      throw new Error('element must be a of type HTMLElement');
	   }
	
	   return {
	
	      view: {
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
	      },
	      scene: {
	         top: function top() {
	            var rect = element.getBoundingClientRect();
	            return rect.top + document.body.scrollTop;
	         },
	         left: function left() {
	            var rect = element.getBoundingClientRect();
	            return rect.left + document.body.scrollLeft;
	         },
	         width: function width() {
	            return element.offsetWidth;
	         },
	         height: function height() {
	            return element.offsetHeight;
	         }
	      }
	
	   };
	};

/***/ }
/******/ ])
});
;
//# sourceMappingURL=scrollscout.js.map