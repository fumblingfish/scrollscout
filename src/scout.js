import _ from 'lodash'
import createObserver from './observer'
import Trigger from './trigger'
import scoutEvents from './scoutEvents'
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

export const targetPointPair = function (stateView, stateScene, trigger) {
   return [
      targetPoint(stateView[0], stateView[1], trigger._view.position, trigger._view.offset),
      targetPoint(stateScene[0], stateScene[1], trigger._scene.position, trigger._scene.offset)
   ]
}

export const someAxis = function (axis) {
   return function (listeners, triggers) {
      return _.some(listeners, (listener) => {
         return ( triggers[listener.type]._axis === axis )
      })
   }
}

export const axisPair = function (axis, viewState, sceneState) {
   return (axis === AXIS_Y) ?
      [[viewState.y1, viewState.y2], [sceneState.y1, sceneState.y2]] :
      [[viewState.x1, viewState.x2], [sceneState.x1, sceneState.x2]]
}

export const triggerObj = function (trigger) {
   const {pT, nT} = trigger
   const pDist = pT[1] - pT[0]
   const nDist = nT[0] - nT[1]
   const move = pDist + nDist
   const pDistRatio = pDist / move
   return {move, pDist, nDist, pDistRatio, ...trigger}
}

const smallestDistRatioFirst = function (a, b) {
   return a.pDistRatio < b.pDistRatio ? -1 : 1
}

export const notificationOrder = function (triggers) {
   return triggers.sort(smallestDistRatioFirst)
}

const someAxisX = someAxis(AXIS_X)
const someAxisY = someAxis(AXIS_Y)

export default function scout(obsvr, view, scene, optns) {

   var observer = obsvr,
      options = optns,
      contextEnv,
      triggers = {},
      triggersToUpdate = [],
      hasAxisY = false,
      hasAxisX = false,
      shouldRefreshBeforeUpdate = true,
      cachedUpdate,
      debugging = false,
      contextDebugger;

   const triggerChange = function () {
      shouldRefreshBeforeUpdate = true
   }

   const addListener = function (trgName, fn) {
      if (!triggers[trgName]) {
         console.warn(`addListener could not find a Trigger with name ${trgName}`)
         return
      }
      shouldRefreshBeforeUpdate = true
      return observer.addListener(trgName, fn)
   }

   const removeListener = function (trgName, fn) {
      return observer.removeListener(trgName, fn)
   }

   const removeAllListeners = function () {
      return observer.removeAllListeners()
   }

   const getListeners = function () {
      return observer.getListeners()
   }

   const notifyListeners = function (trgName, evt) {
      return observer.notifyListeners(trgName, evt)
   }

   const addTrigger = function (trgName) {
      if(!_.isString(trgName)){
         console.warn(`Trigger name must be a string. see addTrigger`)
         return false
      }
      if (triggers[trgName]) {
         console.warn(`Trigger name must be unique. ${trgName} is already added`)
         return triggers[trgName]
      }
      const trg = new Trigger(trgName, _scout)
      triggers[trgName] = trg
      return trg
   }

   const removeTrigger = function (trgName) {
      const listeners = observer.getListeners()
      const listenersWithTriggerName = _.filter(listeners, (lnr) => lnr.type === trgName)
      _.forEach(listenersWithTriggerName, (lsnr) => {
         observer.removeListener(trgName, lsnr.callback)
      })
      shouldRefreshBeforeUpdate = true
      triggersToUpdate = _.filter(triggersToUpdate, (trg) => trg._name !== trgName)
      return delete triggers[trgName]
   }

   const getTrigger = function (trgName) {
      return triggers[trgName]
   }

   const isDebugging = function () {
      return debugging
   }

   const debug = function (value) {
      if (value === false) {
         _.keysIn(triggers).forEach(key => triggers[key].debug(false))
      } else {
         _.keysIn(triggers).forEach(key => triggers[key].debug(true))
      }
      update()
   }

   const refreshProps = function () {
      const listeners = observer.getListeners()

      //refresh
      triggersToUpdate = _.valuesIn(triggers, (trg) => trg)
      hasAxisX = someAxisX(listeners, triggers)
      hasAxisY = someAxisY(listeners, triggers)
      shouldRefreshBeforeUpdate = false

      let envState

      triggersToUpdate.forEach((trg) => {
         if (!trg._pT) {
            envState = envState ? envState : createInitialState(contextEnv, hasAxisX, hasAxisY)
            const prevStatePair = axisPair(trg._axis, envState.view, envState.scene)
            trg._pT = targetPointPair(prevStatePair[0], prevStatePair[1], trg)
         }
      })

      const triggersToDebug = _.filter(triggersToUpdate, trigger => trigger._debug)

      if (triggersToDebug.length > 0) {
         debugging = true
         if (contextDebugger) {
            contextDebugger.clearTriggers()
         } else {
            contextDebugger = contextEnv.debug()
         }
         contextDebugger.addTriggers(triggersToDebug)
         cachedUpdate = !cachedUpdate ? updateScout : cachedUpdate
         updateScout = () => {
            cachedUpdate.apply(this, arguments)
            contextDebugger.update(triggersToDebug)
         }
         updateScout()
      } else if (debugging) {
         debugging = false
         contextEnv.debugStop()
         updateScout = cachedUpdate
         cachedUpdate = null
         contextDebugger.clearTriggers()
      }
      if (contextDebugger) {
         contextDebugger.cleanUp(triggersToDebug)
      }
   }

   var updateScout = function () {

      if (shouldRefreshBeforeUpdate) {
         refreshProps()
      }

      const nextState = createState(contextEnv, hasAxisX, hasAxisY)
      let resolvedTriggers = _.map(triggersToUpdate, (trg) => {
         const pT = trg._pT
         const predicate = directionPredicates[trg._direction]
         const nextStatePair = axisPair(trg._axis, nextState.view, nextState.scene)
         const nT = targetPointPair(nextStatePair[0], nextStatePair[1], trg)
         const notify = predicate(pT[0], pT[1], nT[0], nT[1])
         return {trigger:trg, pT, nT, notify}
      })

      _.forEach(resolvedTriggers, (trgObj) => {
         trgObj.trigger._pT = trgObj.nT
      })

      const resolvedTriggersToNotify = _.filter(resolvedTriggers, (resolvedTrg) => resolvedTrg.notify)
      const triggersToNotify = _.map(resolvedTriggersToNotify, triggerObj)
      const ordered = triggersToNotify.length > 1 ? notificationOrder(triggersToNotify) : triggersToNotify

      _.forEach(ordered, (resolvedTrg) => {
         const {trigger} = resolvedTrg
         var evtObject = {
            target: trigger,
            state: {view: trigger._pT[0], scene: trigger._pT[1]},
            sceneViewDistance: resolvedTrg.nDist,
            move: resolvedTrg.move,
            axis: resolvedTrg.trigger._axis,
         }
         notifyListeners(resolvedTrg.trigger._name, evtObject)
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


   var _scout = {
      // public
      addTrigger,
      removeTrigger,
      getTrigger,
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
      _triggerChange: triggerChange,
      _notifyListeners: notifyListeners,
   }

   _scout.on = scoutEvents(_scout, createObserver())

   contextEnv = options.context(view, scene, _scout)

   return _scout

}
