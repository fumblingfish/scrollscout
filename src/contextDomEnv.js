
export const contextViewWindow = function () {
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

export const contextSceneWindow = function (sceneElement) {
   return {
      top: () => {
         const v = document.body.getBoundingClientRect().top
         const s = sceneElement.getBoundingClientRect().top
         return s - v
      },
      left: () => {
         const v = document.body.getBoundingClientRect().left
         const s = sceneElement.getBoundingClientRect().left
         return s - v
      },
      width: () => sceneElement.offsetWidth,
      height: () => sceneElement.offsetHeight,
   }
}

export const contextViewElement = function (viewElement) {
   return {
      top: () => viewElement.scrollTop,
      left: () => viewElement.scrollLeft,
      width: () => viewElement.offsetWidth,
      height: () => viewElement.offsetHeight,
   }
}

export const contextSceneElement = function (viewElement, sceneElement) {
   return {
      top: () => {
         const vs = viewElement.scrollTop
         const v = viewElement.getBoundingClientRect().top
         const s = sceneElement.getBoundingClientRect().top
         return s - v + vs
      },
      left: () => {
         const vs = viewElement.scrollLeft
         const v = viewElement.getBoundingClientRect().left
         const s = sceneElement.getBoundingClientRect().left
         return s - v + vs
      },
      width: () => sceneElement.offsetWidth,
      height: () => sceneElement.offsetHeight,
   }
}

