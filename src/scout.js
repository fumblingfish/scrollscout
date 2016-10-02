import _ from 'lodash'
import Pin from './pin'
import createState, {createInitialState} from './createState'
import {AXIS_X, AXIS_Y, FORWARD, BACKWARD} from './constants'

export const passesForward = (pv, ps, nv, ns) => (pv < ps) && (nv >= ns)
export const passesBackward = (pv, ps, nv, ns) => (pv > ps) && (nv <= ns)

export const directionPredicates = {
   [FORWARD]: passesForward,
   [BACKWARD]: passesBackward,
}

export const targetPoint = function (a1, a2, p, o) {
   return (a1 + a2 * p) + o
}

export const targetPointPair = function (stateView, stateScene, pin) {
   return [
      targetPoint(stateView[0], stateView[1], pin._view.position, pin._view.offset),
      targetPoint(stateScene[0], stateScene[1], pin._scene.position, pin._scene.offset)
   ]
}

export const someAxis = function (axis) {
   return function (listeners, pins) {
      return _.some(listeners, (listener) => {
         return ( pins[listener.type]._axis === axis )
      })
   }
}

export const axisPair = function (axis, viewState, sceneState) {
   return (axis === AXIS_Y) ?
      [[viewState.y1, viewState.y2], [sceneState.y1, sceneState.y2]] :
      [[viewState.x1, viewState.x2], [sceneState.x1, sceneState.x2]]
}

export const pinDetails = function (pinObj) {
   const {pT, nT} = pinObj
   const pDist = pT[1] - pT[0]
   const nDist = nT[0] - nT[1]
   const move = pDist + nDist
   const pDistRatio = pDist / move
   return {move, pDist, nDist, pDistRatio, ...pinObj}
}

const smallestDistRatioFirst = function (a, b) {
   return a.pDistRatio < b.pDistRatio ? -1 : 1
}

export const notificationOrder = function (pins) {
   return pins.sort(smallestDistRatioFirst)
}

const someAxisX = someAxis(AXIS_X)
const someAxisY = someAxis(AXIS_Y)

export default function scout(obsvr, view, scene, optns) {

   var observer = obsvr,
      options = optns,
      contextEnv,
      pins = {},
      pinsToUpdate = [],
      hasAxisY = false,
      hasAxisX = false,
      shouldRefreshBeforeUpdate = true,
      cachedUpdate,
      debugging = false,
      contextDebugger;

   const pinChanges = function () {
      shouldRefreshBeforeUpdate = true
   }

   const addListener = function (pinName, fn) {
      if (!pins[pinName]) {
         console.warn(`addListener could not find a Pin with name ${pinName}`)
         return
      }
      shouldRefreshBeforeUpdate = true
      return observer.addListener(pinName, fn)
   }

   const removeListener = function (fn) {
      return observer.removeListener(fn)
   }

   const removeAllListeners = function (fn) {
      return observer.removeAllListeners(fn)
   }

   const getListeners = function () {
      return observer.getListeners()
   }

   const notifyListeners = function (pinName, evt) {
      return observer.notifyListeners(pinName, evt)
   }

   const addPin = function (pinName) {
      if(_.isNil(pinName)){
         console.warn(`name must be a string. see addPin`)
         return false
      }
      if (pins[pinName]) {
         console.warn(`Pin name must be unique. ${pinName} is already added`)
         return pins[pinName]
      }
      const pin = new Pin(pinName, _scoutInternal)
      pins[pinName] = pin
      return pin
   }

   const removePin = function (pinName) {
      const listeners = observer.getListeners()
      const listenersWithPinName = _.filter(listeners, (lnr) => lnr.type === pinName)
      _.forEach(listenersWithPinName, (lsnr) => {
         observer.removeListenerById(lsnr.id)
      })
      shouldRefreshBeforeUpdate = true
      pinsToUpdate = _.filter(pinsToUpdate, (pin) => pin._name !== pinName)
      return delete pins[pinName]
   }

   const getPin = function (pinName) {
      return pins[pinName]
   }

   const isDebugging = function () {
      return debugging
   }

   const debug = function (value) {
      if (value === false) {
         _.keysIn(pins).forEach(key => {
            pins[key].debug(false)
         })
      } else {
         _.keysIn(pins).forEach(key => {
            pins[key].debug(true)
         })
      }
      update()
   }

   const refreshProps = function () {
      const listeners = observer.getListeners()

      //refresh
      pinsToUpdate = _.valuesIn(pins, (pin) => pin)
      hasAxisX = someAxisX(listeners, pins)
      hasAxisY = someAxisY(listeners, pins)
      shouldRefreshBeforeUpdate = false

      let envState

      pinsToUpdate.forEach((pin) => {
         if (!pin._pT) {
            envState = envState ? envState : createInitialState(contextEnv, hasAxisX, hasAxisY)
            const prevStatePair = axisPair(pin._axis, envState.view, envState.scene)
            pin._pT = targetPointPair(prevStatePair[0], prevStatePair[1], pin)
         }
      })

      const pinsToDebug = _.filter(pinsToUpdate, pin => pin._debug)

      if (pinsToDebug.length > 0) {
         debugging = true
         if (contextDebugger) {
            contextDebugger.clearPins()
         } else {
            contextDebugger = contextEnv.debug()
         }
         contextDebugger.addPins(pinsToDebug)
         cachedUpdate = !cachedUpdate ? updateScout : cachedUpdate
         updateScout = () => {
            cachedUpdate.apply(this, arguments)
            contextDebugger.update(pinsToDebug)
         }
         updateScout()
      } else if (debugging) {
         debugging = false
         contextEnv.debugStop()
         updateScout = cachedUpdate
         cachedUpdate = null
         contextDebugger.clearPins()
      }
      if (contextDebugger) {
         contextDebugger.cleanUp(pinsToDebug)
      }
   }

   var updateScout = function () {

      if (shouldRefreshBeforeUpdate) {
         refreshProps()
      }

      const nextState = createState(contextEnv, hasAxisX, hasAxisY)
      let resolvedPins = _.map(pinsToUpdate, (pin) => {
         const pT = pin._pT
         const predicate = directionPredicates[pin._direction]
         const nextStatePair = axisPair(pin._axis, nextState.view, nextState.scene)
         const nT = targetPointPair(nextStatePair[0], nextStatePair[1], pin)
         const notify = predicate(pT[0], pT[1], nT[0], nT[1])
         return {pin, pT, nT, notify}
      })

      _.forEach(resolvedPins, (pinObj) => {
         pinObj.pin._pT = pinObj.nT
      })

      const resolvedPinsToNotify = _.filter(resolvedPins, (resolvedPin) => resolvedPin.notify)
      const pinsToNotify = _.map(resolvedPinsToNotify, pinDetails)
      const ordered = pinsToNotify.length > 1 ? notificationOrder(pinsToNotify) : pinsToNotify

      _.forEach(ordered, (resolvedPin) => {
         const {pin} = resolvedPin
         var evtObject = {
            target: pin,
            state: {view: pin._pT[0], scene: pin._pT[1]},
            sceneViewDistance: resolvedPin.nDist,
            move: resolvedPin.move,
            axis: resolvedPin.pin._axis,
         }
         notifyListeners(resolvedPin.pin._name, evtObject)
      })
   }

   const update = function () {
      updateScout()
   }

   const start = function (resizeUpdateFn, scrollUpdateFn) {
      contextEnv.start(resizeUpdateFn, scrollUpdateFn)
   }

   const stop = function () {
      contextEnv.stop()
   }

   if (options.runInitialUpdate) {
      if (typeof window !== 'undefined' && window.requestAnimationFrame) {
         window.requestAnimationFrame(updateScout)
      }
   }

   var _scoutInternal = {
      addListener,
      removePin,
      pinChanges,
      update
   }

   contextEnv = options.context(view, scene, _scoutInternal)

   return {

      // scrollscout api
      addPin,
      removePin,
      getPin,
      update,
      debug,
      start,
      stop,

      // private
      _addListener: addListener,
      _removeListener: removeListener,
      _removeAllListeners: removeAllListeners,
      _getListeners: getListeners,
      _isDebugging: isDebugging,
      _notifyListeners: notifyListeners,
   }
}
