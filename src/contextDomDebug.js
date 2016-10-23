import {BACKWARD} from './constants'
import {targetPoint} from './scout'

const colors = ['deeppink', 'lime', 'cyan', 'orangeRed', 'yellow', 'fuchsia']
var colorIndex = 0
var UID = 0

const uid = function () {
   return UID++
}

const propMap = {
   x: {
      orientation: 'left',
      sides: ['bottom', 'top'],
      size: ['width', 'height'],
      arrowChar: ['&#x21e2;', '&#x21e0;'],
      translate: ['translateX', 'translateY']
   },
   y: {
      orientation: 'top',
      sides: ['right', 'left'],
      size: ['height', 'width'],
      arrowChar: ['&#x21e3;', '&#x21e1;'],
      translate: ['translateY', 'translateX']
   }
}

const translate = (axis, value) => `${axis}(${value}px)`

const createMarker = function (targetType, trg) {

   const axisStyle = propMap[trg._axis]
   const dir = trg._direction === BACKWARD ? 1 : 0

   const marker = document.createElement('div')
   const line = document.createElement('div')
   const title = document.createElement('div')
   const dirPointer = document.createElement('div')
   const markerName = document.createTextNode(trg._name)

   title.appendChild(markerName)
   marker.appendChild(dirPointer)
   marker.appendChild(line)
   marker.appendChild(title)

   dirPointer.style.fontSize = '20px'
   dirPointer.style.position = 'absolute'
   dirPointer.style[axisStyle.orientation] = '-22px'
   dirPointer.style[axisStyle.sides[dir]] = '20px'
   dirPointer.style.width = '22px'
   dirPointer.style.height = '22px'
   dirPointer.style.textAlign = 'center'

   line.style.position = 'absolute'
   line.style.background = trg._debugColor
   line.style[axisStyle.sides[dir]] = '0px'
   line.style[axisStyle.size[0]] = '1px'
   line.style[axisStyle.size[1]] = '80px'

   title.style.position = 'absolute'
   title.style[axisStyle.orientation] = '5px'

   marker.id = `__marker__${targetType}__${trg._name}`
   marker.style[axisStyle.orientation] = 0
   marker.style.cssText = 'position:fixed; font-family:consolas, monospace; font-size:10px;'
   marker.style.zIndex = 100000
   marker.style.color = trg._debugColor
   marker.style.width = '100%'
   marker.style.pointerEvents = 'none'

   return {marker, line, title, dirPointer}
}

const styleMarkerView = function (markObj, trg) {
   const {marker, title, dirPointer} = markObj
   const axisStyle = propMap[trg._axis]
   const dir = trg._direction === BACKWARD ? 1 : 0
   marker.style[axisStyle.sides[dir]] = '0px'
   title.style[axisStyle.sides[dir]] = '15px'
   title.style.textAlign = axisStyle.sides[dir]
   dirPointer.style[axisStyle.sides[dir]] = '60px'
   return markObj.marker
}


const styleMarkerScene = function (markObj, trg) {
   const {marker, line, title, dirPointer} = markObj
   const axisStyle = propMap[trg._axis]
   const dir = trg._direction === BACKWARD ? 1 : 0
   const dirInv = dir ? 0 : 1
   marker.style[axisStyle.sides[dir]] = '40px'
   line.style.background = trg._debugColor
   line.style[axisStyle.size[1]] = '40px'
   title.style[axisStyle.sides[dir]] = '0px'
   title.style.textAlign = axisStyle.sides[dir]
   dirPointer.innerHTML = axisStyle.arrowChar[dirInv]
   return markObj.marker
}

const createDebugContainer = function () {
   const debugContainer = document.createElement('div')
   debugContainer.id = `__scrollscout_debug__container_${uid()}`
   debugContainer.className = "__scrollscout_debug__container"
   debugContainer.style.position = 'fixed'
   debugContainer.style.zIndex = 9999999
   debugContainer.style.pointerEvents = 'none'
   return debugContainer
}

const px = function (value) {
   return `${value}px`
}


const colorMarker = function (trg) {
   trg._debugColor = trg._debugColor ? trg._debugColor : colors[colorIndex++]
   colorIndex = (colorIndex === colors.length)
      ? 0
      : colorIndex
   return trg
}

export const contextDebug = function (viewElement) {
   const contextDom = this,
      isViewWindow = viewElement === window

   var debugContainer = createDebugContainer()

   if (isViewWindow) {
      debugContainer.style.top = '0px'
      debugContainer.style.left = '0px'
      debugContainer.style.right = '0px'
      debugContainer.style.bottom = '0px'
   }

   document.body.appendChild(debugContainer)
   return {
      addTriggers(triggers){
         triggers.forEach(function (trg) {
            colorMarker(trg)
            const markerView = createMarker('view', trg)
            const markerScene = createMarker('scene', trg)
            trg.__debugViewMarker = styleMarkerView(markerView, trg)
            trg.__debugSceneMarker = styleMarkerScene(markerScene, trg)
            debugContainer.appendChild(trg.__debugViewMarker)
            debugContainer.appendChild(trg.__debugSceneMarker)


            if (!isViewWindow) {
               trg.__debugViewMarker.style.position = 'absolute'
               trg.__debugSceneMarker.style.position = 'absolute'
            }
         })
      },
      update(triggers){
         triggers.forEach(function (trg) {
            const axisStyle = propMap[trg._axis]
            const nT = trg._pT
            if (isViewWindow) {
               const viewSize = contextDom.view[axisStyle.size[0]]()
               const viewPos = contextDom.view[axisStyle.orientation]()
               const positionView = targetPoint(0, viewSize, trg._view.position, trg._view.offset)
               trg.__debugViewMarker.style.transform = translate(axisStyle.translate[0], positionView)
               trg.__debugSceneMarker.style.transform = translate(axisStyle.translate[0], nT[1] - viewPos)
            } else {
               const viewSize = contextDom.view[axisStyle.size[0]]()
               const viewPos = contextDom.view[axisStyle.orientation]()
               const positionView = targetPoint(0, viewSize, trg._view.position, trg._view.offset)

               trg.__debugViewMarker.style[axisStyle.orientation] = `${positionView}px`
               trg.__debugSceneMarker.style[axisStyle.orientation] = `${nT[1] - viewPos}px`

               debugContainer.style.top = px(viewElement.getBoundingClientRect().top)
               debugContainer.style.left = px(viewElement.getBoundingClientRect().left)
               debugContainer.style.width = px(contextDom.view.width())
               debugContainer.style.height = px(contextDom.view.height())
            }
         })
      },
      clearTriggers(){
         while (debugContainer.firstChild) {
            debugContainer.removeChild(debugContainer.firstChild)
         }
         colorIndex = 0
      },
      clearAll(){
         document.body.removeChild(debugContainer)
      },
      cleanUp(triggers){
         if(!triggers) return
         triggers.forEach(function(trg){
            if(!trg._debug && trg.__debugViewMarker instanceof HTMLElement){
              debugContainer.removeChild(trg.__debugViewMarker)
            }
         })
      }
   }

}
