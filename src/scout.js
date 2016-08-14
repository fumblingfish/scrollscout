import Pin from './pin'
import createState, {createInitialState} from './createState'
import {unique, filterOverKeyValue} from './common'
import {AXIS_X, AXIS_Y} from './constants'
import {directionPredicates} from './predicates'


const defaultOptions = {
   runInitialUpdate: true,
}

export const targetPoint = function (a1, a2, p, o) {
   return (a1 + a2 * p) + o
}

export const targetPointPair = function (stateView, stateScene, pin) {
   return [
      targetPoint(stateView[0], stateView[1], pin._viewPosition, pin._viewOffset),
      targetPoint(stateScene[0], stateScene[1], pin._scenePosition, pin._sceneOffset)
   ]
}

export const someAxis = function (axis) {
   return function (listeners, pins) {
      return listeners.some((listener) => {
         return ( pins[listener.type]._axis === axis )
      })
   }
}

const someAxisX = someAxis(AXIS_X)
const someAxisY = someAxis(AXIS_Y)

export default function scout(obs, opt, inpEnv) {

   var observer = obs,
      options = Object.assign(defaultOptions, opt),
      inputEnv = inpEnv,
      pins = {},
      pinSubscribers = [],
      prevState,
      feedY = false,
      feedX = false,
      shouldRefreshBeforeUpdate = true,
      initialized = false


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
      //Todo: must be unique and must be string
      const pin = new Pin(pinName, {addListener, pinChanges})
      pins[pinName] = pin
      return pin
   }

   const removePin = function(pinName){
      const listeners = observer.getListeners()
      const listenersWithPinName = listeners.filter((lnr) => lnr.type === pinName)
      listenersWithPinName.forEach((lsnr) => {
         observer.removeListenerById(lsnr.id)
      })
      return delete pins[pinName]
   }

   const initialize = function () {
      prevState = createInitialState(inputEnv, feedX, feedY)
      initialized = true
   }

   const refreshTerms = function () {
      const listeners = observer.getListeners()
      const types = listeners.map((l) => l.type)
      const uniqueSubscribers = types.filter(unique(types))

      //refresh
      pinSubscribers = filterOverKeyValue(pins, uniqueSubscribers)
      feedX = someAxisX(listeners, pins)
      feedY = someAxisY(listeners, pins)
      shouldRefreshBeforeUpdate = false
   }

   const anonymousAxisPair = function (axis, viewState, sceneState) {
      return axis === AXIS_Y ?
         [[viewState.y1, viewState.y2], [sceneState.y1, sceneState.y2]] :
         [[viewState.x1, viewState.x2], [sceneState.x1, sceneState.x2]]
   }

   const update = function (fn) {
      if (shouldRefreshBeforeUpdate) {
         refreshTerms()
      }
      if (!initialized) {
         initialize()
      }
      const nextState = createState(inputEnv, feedX, feedY)
      pinSubscribers.forEach((pin) => {
         const predicate = directionPredicates[pin._direction]
         const prevStatePair = anonymousAxisPair(pin._axis, prevState.view, prevState.scene)
         const nextStatePair = anonymousAxisPair(pin._axis, nextState.view, nextState.scene)
         const pT = targetPointPair(prevStatePair[0], prevStatePair[1], pin)
         const nT = targetPointPair(nextStatePair[0], nextStatePair[1], pin)
         const passed = predicate(pT[0], pT[1], nT[0], nT[1])
         if (passed) notifyListeners(pin._name, {})
      })
      prevState = nextState
   }

   const getPin = function(pinName){
      return pins[pinName]
   }

   if (options.runInitialUpdate) {
      if (typeof window !== 'undefined' && window.requestAnimationFrame) {
         window.requestAnimationFrame(update)
      }
   }

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
   }
}
