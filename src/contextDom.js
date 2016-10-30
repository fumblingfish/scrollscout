import _ from 'lodash'

import {contextDebug} from './contextDomDebug'

import {
   contextViewWindow,
   contextViewElement,
   contextSceneWindow,
   contextSceneElement,
} from './contextDomEnv'

export default function (viewElement, sceneElement, scout) {
   var contextView,
      contextScene,
      resizeUpdateFn,
      scrollUpdateFn,
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
      window.requestAnimationFrame(scout.update)
   }

   const startUpdate = function (userResizeUpdateFn, userScrollUpdateFn) {
      resizeUpdateFn = _.isFunction(userResizeUpdateFn) ? userResizeUpdateFn(updateHandler) : updateHandler
      scrollUpdateFn = _.isFunction(userScrollUpdateFn) ? userScrollUpdateFn(updateHandler) : updateHandler
      viewElement.removeEventListener('scroll', scrollUpdateFn)
      viewElement.removeEventListener('resize', resizeUpdateFn)
      viewElement.addEventListener('scroll', scrollUpdateFn)
      viewElement.addEventListener('resize', resizeUpdateFn)
   }

   const stopUpdate = function () {
      viewElement.removeEventListener('scroll', scrollUpdateFn)
      viewElement.removeEventListener('resize', resizeUpdateFn)
   }

   return {
      view: contextView,
      scene: contextScene,
      debug(){
         if (viewElement instanceof HTMLElement && !debugging) {
            const resizeUpdate = resizeUpdateFn ? resizeUpdateFn : updateHandler
            const scrollUpdate = scrollUpdateFn ? scrollUpdateFn : updateHandler
            window.removeEventListener('scroll', scrollUpdate)
            window.removeEventListener('resize', resizeUpdate)
            window.addEventListener('scroll', scrollUpdate)
            window.addEventListener('resize', resizeUpdate)
         }
         debugging = true
         return contextDebug.call(this, viewElement, sceneElement)
      },
      debugStop(){
         if (viewElement instanceof HTMLElement && debugging) {
            const resizeUpdate = resizeUpdateFn ? resizeUpdateFn : updateHandler
            const scrollUpdate = scrollUpdateFn ? scrollUpdateFn : updateHandler
            window.removeEventListener('scroll', scrollUpdate)
            window.removeEventListener('resize', resizeUpdate)
         }
         debugging = false
      },
      start: startUpdate,
      stop: stopUpdate
   }
}



