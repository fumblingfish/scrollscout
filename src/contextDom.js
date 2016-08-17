const contextWindow = function (window) {
   return {
      top: () => {
         var doc = document.documentElement
         return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
      },
      left: () => {
         var doc = document.documentElement
         return (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)
      },
      width: () => window.innerWidth,
      height: () => window.innerHeight,
   }
}

const contextViewElement = function (element) {
   return {
      top: () => element.scrollTop,
      left: () => element.scrollLeft,
      width: () => element.offsetWidth,
      height: () => element.offsetHeight,
   }
}

const contextSceneElement = function (element) {
   return {
      top: () => element.offsetTop,
      left: () => element.offsetLeft,
      width: () => element.offsetWidth,
      height: () => element.offsetHeight,
   }
}

export default function (viewElement, sceneElement) {
   var contextView = Function.prototype
   if (typeof window !== 'undefined') {
      if (!(sceneElement instanceof HTMLElement)) {
         throw new Error('element must be a of type HTMLElement')
      }
      if (viewElement === window || viewElement === 'window') {
         contextView = contextWindow
      } else if (viewElement instanceof HTMLElement) {
         viewElement.style.position = 'relative'
         contextView = contextViewElement
      }
   }
   return {
      view: contextView(viewElement),
      scene: contextSceneElement(sceneElement),
   }
}



