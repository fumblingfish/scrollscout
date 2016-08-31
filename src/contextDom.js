import {contextDebug, contextDebugUpdate} from './contextDomDebug'
import {isFunction} from './common'
import {
   contextViewWindow,
   contextViewElement,
   contextSceneWindow,
   contextSceneElement,
} from './contextDomEnv'

export default function (viewElement, sceneElement, scout) {
   var contextView,
      contextScene,
      updateFn,
      debugging

   if (typeof window !== 'undefined') {
      if (!(sceneElement instanceof HTMLElement)) {
         throw new Error('element must be a of type HTMLElement', sceneElement)
      }
      if (viewElement === window || viewElement === 'window') {
         contextView = contextViewWindow(viewElement)
         contextScene = contextSceneWindow(sceneElement)
      } else if (viewElement instanceof HTMLElement) {
         contextView = contextViewElement(viewElement)
         contextScene = contextSceneElement(viewElement, sceneElement)
      }
   }
   const updateHandler = function () {
      scout.update()
   }

   const startUpdater = function (exposeUpdateFn) {
      updateFn = isFunction(exposeUpdateFn) ? exposeUpdateFn(updateHandler) : updateHandler
      viewElement.removeEventListener('scroll', updateFn)
      viewElement.removeEventListener('resize', updateFn)
      viewElement.addEventListener('scroll', updateFn)
      viewElement.addEventListener('resize', updateFn)
   }

   const stopUpdater = function () {
      viewElement.removeEventListener('scroll', updateFn)
      viewElement.removeEventListener('resize', updateFn)
   }

   return {
      view: contextView,
      scene: contextScene,
      debug(pinsToDebug){
         if (viewElement instanceof HTMLElement && !debugging) {
            const update = updateFn ? updateFn : updateHandler
            window.removeEventListener('scroll', update)
            window.removeEventListener('resize', update)
            window.addEventListener('scroll', update)
            window.addEventListener('resize', update)
         }
         debugging = true
         return contextDebug.call(this, viewElement, sceneElement, pinsToDebug)
      },
      debugStop(contextDebugger){
         if (viewElement instanceof HTMLElement && debugging) {
            const update = updateFn ? updateFn : updateHandler
            window.removeEventListener('scroll', update)
            window.removeEventListener('resize', update)
         }
         debugging = false
         contextDebugger.clearAll()
      },
      run: startUpdater,
      stop: stopUpdater
   }
}



