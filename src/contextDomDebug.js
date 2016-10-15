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

const createMarker = function (targetType, pin) {

   const axisStyle = propMap[pin._axis]
   const dir = pin._direction === BACKWARD ? 1 : 0

   const marker = document.createElement('div')
   const line = document.createElement('div')
   const title = document.createElement('div')
   const dirPointer = document.createElement('div')
   const markerName = document.createTextNode(pin._name)

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
   line.style.background = pin._debugColor
   line.style[axisStyle.sides[dir]] = '0px'
   line.style[axisStyle.size[0]] = '1px'
   line.style[axisStyle.size[1]] = '80px'

   title.style.position = 'absolute'
   title.style[axisStyle.orientation] = '5px'

   marker.id = `__pin__${targetType}__${pin._name}`
   marker.style[axisStyle.orientation] = 0
   marker.style.cssText = 'position:fixed; font-family:consolas, monospace; font-size:10px;'
   marker.style.zIndex = 100000
   marker.style.color = pin._debugColor
   marker.style.width = '100%'
   marker.style.pointerEvents = 'none'

   return {marker, line, title, dirPointer}
}

const styleMarkerView = function (markObj, pin) {
   const {marker, title, dirPointer} = markObj
   const axisStyle = propMap[pin._axis]
   const dir = pin._direction === BACKWARD ? 1 : 0
   marker.style[axisStyle.sides[dir]] = '0px'
   title.style[axisStyle.sides[dir]] = '15px'
  // title.style.width = '100px'
   title.style.textAlign = axisStyle.sides[dir]
   dirPointer.style[axisStyle.sides[dir]] = '60px'
   return markObj.marker
}


const styleMarkerScene = function (markObj, pin) {
   const {marker, line, title, dirPointer} = markObj
   const axisStyle = propMap[pin._axis]
   const dir = pin._direction === BACKWARD ? 1 : 0
   const dirInv = dir ? 0 : 1
   marker.style[axisStyle.sides[dir]] = '40px'
   line.style.background = pin._debugColor
   line.style[axisStyle.size[1]] = '40px'
   title.style[axisStyle.sides[dir]] = '0px'
  // title.style.width = '100px'
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


const colorPin = function (pin) {
   pin._debugColor = pin._debugColor ? pin._debugColor : colors[colorIndex++]
   colorIndex = colorIndex === colors.length ? 0 : colorIndex
   return pin
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
      addPins(pins){
         pins.forEach(function (pin) {
            colorPin(pin)
            const markerView = createMarker('view', pin)
            const markerScene = createMarker('scene', pin)
            pin.__debugViewMarker = styleMarkerView(markerView, pin)
            pin.__debugSceneMarker = styleMarkerScene(markerScene, pin)
            debugContainer.appendChild(pin.__debugViewMarker)
            debugContainer.appendChild(pin.__debugSceneMarker)


            if (!isViewWindow) {
               pin.__debugViewMarker.style.position = 'absolute'
               pin.__debugSceneMarker.style.position = 'absolute'
            }
         })
      },
      update(pins){
         pins.forEach(function (pin) {
            const axisStyle = propMap[pin._axis]
            const nT = pin._pT
            if (isViewWindow) {
               const viewSize = contextDom.view[axisStyle.size[0]]()
               const viewPos = contextDom.view[axisStyle.orientation]()
               const positionView = targetPoint(0, viewSize, pin._view.position, pin._view.offset)
               pin.__debugViewMarker.style.transform = translate(axisStyle.translate[0], positionView)
               pin.__debugSceneMarker.style.transform = translate(axisStyle.translate[0], nT[1] - viewPos)
            } else {
               const viewSize = contextDom.view[axisStyle.size[0]]()
               const viewPos = contextDom.view[axisStyle.orientation]()
               const positionView = targetPoint(0, viewSize, pin._view.position, pin._view.offset)

               pin.__debugViewMarker.style[axisStyle.orientation] = `${positionView}px`
               pin.__debugSceneMarker.style[axisStyle.orientation] = `${nT[1] - viewPos}px`

               debugContainer.style.top = px(viewElement.getBoundingClientRect().top)
               debugContainer.style.left = px(viewElement.getBoundingClientRect().left)
               debugContainer.style.width = px(contextDom.view.width())
               debugContainer.style.height = px(contextDom.view.height())
            }
         })
      },
      clearPins(){
         while (debugContainer.firstChild) {
            debugContainer.removeChild(debugContainer.firstChild)
         }
         colorIndex = 0
      },
      clearAll(){
         document.body.removeChild(debugContainer)
      },
      cleanUp(pins){
         if(!pins) return
         pins.forEach(function(pin){
            if(!pin._debug && pin.__debugViewMarker instanceof HTMLElement){
              debugContainer.removeChild(pin.__debugViewMarker)
            }
         })
      }
   }

}
