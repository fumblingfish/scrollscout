export default function (inputEnv, calcX, calcY) {
   const view = {}, scene = {}
   if (calcX) {
      view.x1 = inputEnv.viewLeft()
      view.x2 = inputEnv.viewWidth()
      scene.x1 = inputEnv.sceneLeft()
      scene.x2 = inputEnv.sceneWidth()
   }
   if (calcY) {
      view.y1 = inputEnv.viewTop()
      view.y2 = inputEnv.viewHeight()
      scene.y1 = inputEnv.sceneTop()
      scene.y2 = inputEnv.sceneHeight()
   }
   return {view, scene}
}

export const createInitialState = function (inputEnv, calcX, calcY) {
   const view = {}, scene = {}
   if (calcX) {
      view.x1 = 0
      view.x2 = 0
      scene.x1 = inputEnv.sceneLeft()
      scene.x2 = inputEnv.sceneWidth()
   }
   if (calcY) {
      view.y1 = 0
      view.y2 = 0
      scene.y1 = inputEnv.sceneTop()
      scene.y2 = inputEnv.sceneHeight()
   }
   return {view, scene}
}