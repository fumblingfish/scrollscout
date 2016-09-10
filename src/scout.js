import Pin from './pin'
import createState, {createInitialState} from './createState'
import {unique, filterOverKeyValue} from './common'
import {AXIS_X, AXIS_Y} from './constants'
import {directionPredicates} from './predicates'

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
      return listeners.some((listener) => {
         return ( pins[listener.type]._axis === axis )
      })
   }
}

export const axisPair = function (axis, viewState, sceneState) {
   return (axis === AXIS_Y) ?
      [[viewState.y1, viewState.y2], [sceneState.y1, sceneState.y2]] :
      [[viewState.x1, viewState.x2], [sceneState.x1, sceneState.x2]]
}

export const enchancedPins = function (pinObj) {
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

export const resolveTargetPoint = function (pState, nState) {
   return function (pin) {
      const predicate = directionPredicates[pin._direction]
      const prevStatePair = axisPair(pin._axis, pState.view, pState.scene)
      const nextStatePair = axisPair(pin._axis, nState.view, nState.scene)
      const pT = targetPointPair(prevStatePair[0], prevStatePair[1], pin)
      const nT = targetPointPair(nextStatePair[0], nextStatePair[1], pin)
      const notify = predicate(pT[0], pT[1], nT[0], nT[1])
      return {pin, pT, nT, notify}
   }
}

const someAxisX = someAxis(AXIS_X)
const someAxisY = someAxis(AXIS_Y)

export default function scout(obsvr, view, scene, optns) {

   var observer = obsvr,
      options = optns,
      contextEnv,
      pins = {},
      pinSubscribers = [],
      prevState,
      feedY = false,
      feedX = false,
      shouldRefreshBeforeUpdate = true,
      initialized = false,
      cachedUpdate,
      debugging = false,
      contextDebugger


   const pinChanges = function () {
      shouldRefreshBeforeUpdate = true
   }

   const addListener = function (pinName, fn) {
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
      if (pins[pinName]) return false
      const pin = new Pin(pinName, _scoutInternal)
      pins[pinName] = pin
      return pin
   }

   const removePin = function (pinName) {
      const listeners = observer.getListeners()
      const listenersWithPinName = listeners.filter((lnr) => lnr.type === pinName)
      listenersWithPinName.forEach((lsnr) => {
         observer.removeListenerById(lsnr.id)
      })
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
         Object.keys(pins).forEach(key => {
            pins[key].debug(false)
         })
      } else {
         Object.keys(pins).forEach(key => {
            pins[key].debug(true)
         })
      }
      update()
   }

   const initialize = function () {
      prevState = createInitialState(contextEnv, feedX, feedY)
      initialized = true
   }

   const refreshProps = function () {
      const listeners = observer.getListeners()
      const types = listeners.map((l) => l.type)
      const uniqueSubscribers = types.filter(unique(types))

      //refresh
      pinSubscribers = filterOverKeyValue(pins, uniqueSubscribers)
      feedX = someAxisX(listeners, pins)
      feedY = someAxisY(listeners, pins)
      shouldRefreshBeforeUpdate = false

      const pinsToDebug = pinSubscribers.filter(pin => pin._debug)

      if (pinsToDebug.length > 0) {
         debugging = true
         if (contextDebugger) {
            contextDebugger.clearPins()
         }
         contextDebugger = contextEnv.debug(pinsToDebug)
         if (!initialized) {
            // make sure prevState exits before adding debug marks
            initialize()
         }
         cachedUpdate = !cachedUpdate ? updateScout : cachedUpdate
         updateScout = () => {
            cachedUpdate.apply(this, arguments)
            // after cachedUpdate prevState is updated
            contextDebugger.update(prevState)
         }
         updateScout()
      } else if (debugging) {
         debugging = false
         contextEnv.debugStop(contextDebugger)
         updateScout = cachedUpdate
         cachedUpdate = null
      }
   }

   var updateScout = function () {

      if (shouldRefreshBeforeUpdate) {
         refreshProps()
      }
      if (!initialized) {
         initialize()
      }

      const nextState = createState(contextEnv, feedX, feedY)
      const resolvedPins = pinSubscribers.map(resolveTargetPoint(prevState, nextState))
      const resolvedPinsToNotify = resolvedPins.filter((resolvedPin) => resolvedPin.notify)
      const pinsToNotify = resolvedPinsToNotify.map(enchancedPins)
      const ordered = pinsToNotify.length > 1 ? notificationOrder(pinsToNotify) : pinsToNotify

      ordered.forEach((resolvedPin) => {
         notifyListeners(resolvedPin.pin._name, {})
      })

      prevState = nextState
   }

   const update = function () {
      updateScout()
   }

   const run = function (exposeUpdateFn) {
      contextEnv.run(exposeUpdateFn)
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
      addPin,
      addListener,
      removeListener,
      removeAllListeners,
      getListeners,
      notifyListeners,
      update,
      getPin,
      removePin,
      isDebugging,
      debug,
      run,
      stop
   }
}
