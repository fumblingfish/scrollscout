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

const someAxisX = someAxis(AXIS_X)
const someAxisY = someAxis(AXIS_Y)

export default function scout(obsvr, view, scene, optns) {

   var observer = obsvr,
      options = optns,
      contextReader = options.context(view, scene),
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
      if (pins[pinName]) return false

      //Todo: must be unique and must be string
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

   const initialize = function () {
      prevState = createInitialState(contextReader, feedX, feedY)
      console.log('initial prevState:', prevState);
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
   }

   const anonymousAxisPair = function (axis, viewState, sceneState) {
      return (axis === AXIS_Y) ?
         [[viewState.y1, viewState.y2], [sceneState.y1, sceneState.y2]] :
         [[viewState.x1, viewState.x2], [sceneState.x1, sceneState.x2]]
   }

   const update = function (fn) {
      if (shouldRefreshBeforeUpdate) {
         refreshProps()
      }
      if (!initialized) {
         initialize()
      }
      console.log('update');

      const nextState = createState(contextReader, feedX, feedY)
      console.log('nextState:', nextState);
      pinSubscribers.forEach((pin) => {
         const predicate = directionPredicates[pin._direction]
         const prevStatePair = anonymousAxisPair(pin._axis, prevState.view, prevState.scene)
         const nextStatePair = anonymousAxisPair(pin._axis, nextState.view, nextState.scene)
         const pT = targetPointPair(prevStatePair[0], prevStatePair[1], pin)
         const nT = targetPointPair(nextStatePair[0], nextStatePair[1], pin)
         const passed = predicate(pT[0], pT[1], nT[0], nT[1])
         console.log('passed:', passed);
         if (passed) notifyListeners(pin._name, {})
      })
      prevState = nextState
   }

   const getPin = function (pinName) {
      return pins[pinName]
   }

   if (options.runInitialUpdate) {
      if (typeof window !== 'undefined' && window.requestAnimationFrame) {
         window.requestAnimationFrame(update)
      }
   }

   var _scoutInternal = {
      addListener,
      removePin,
      pinChanges
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
