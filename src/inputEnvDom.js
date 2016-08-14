export default function (element) {

   if (typeof window !== 'undefined' && !(element instanceof HTMLElement)) {
      throw new Error('element must be a of type HTMLElement')
   }

   return {
      viewTop: function () {
         var doc = document.documentElement
         return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
      },
      viewHeight: function () {
         return window.innerHeight
      },
      sceneTop: function () {
         var rect = element.getBoundingClientRect()
         return rect.top + document.body.scrollTop
      },
      sceneHeight: function () {
         return element.offsetHeight
      },
      viewLeft: function () {
         var doc = document.documentElement
         return (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)
      },
      viewWidth: function () {
         return window.innerWidth
      },
      sceneLeft: function () {
         var rect = element.getBoundingClientRect()
         return rect.left + document.body.scrollLeft
      },
      sceneWidth: function () {
         return element.offsetWidth
      }
   }
}
