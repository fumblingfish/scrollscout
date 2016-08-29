import {contextDebug, contextDebugUpdate} from './contextDomDebug'
import {
   contextViewWindow,
   contextViewElement,
   contextSceneWindow,
   contextSceneElement,
} from './contextDomEnv'

export default function (viewElement, sceneElement) {
   var contextView, contextScene
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
   return {
      view: contextView,
      scene: contextScene,
      debug: contextDebug,
      debugUpdate: contextDebugUpdate
   }
}



