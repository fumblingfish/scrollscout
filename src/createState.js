export default function (context, calcX, calcY) {
   const view = {}, scene = {}
   const contextView = context.view
   const contextScene = context.scene
   if (calcX) {
      view.x1 = contextView.left()
      view.x2 = contextView.width()
      scene.x1 = contextScene.left()
      scene.x2 = contextScene.width()
   }
   if (calcY) {
      view.y1 = contextView.top()
      view.y2 = contextView.height()
      scene.y1 = contextScene.top()
      scene.y2 = contextScene.height()
   }
   return {view, scene}
}

export const createInitialState = function (context, calcX, calcY) {
   const view = {}, scene = {}
   const contextScene = context.scene
   if (calcX) {
      view.x1 = 0
      view.x2 = 0
      scene.x1 = contextScene.left()
      scene.x2 = contextScene.width()
   }
   if (calcY) {
      view.y1 = 0
      view.y2 = 0
      scene.y1 = contextScene.top()
      scene.y2 = contextScene.height()
   }
   return {view, scene}
}