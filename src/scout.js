import { sanityCheckEventBuilder } from './sanitycheck'
import Pin from './pin'


export default function scout(observer, scene, options){

   var pins = {}

   const addListener = function(pinName, fn){
      return observer.addListener(pinName, fn)
   }

   var removeListener = function (fn) {
      return observer.removeListener(fn)
   }

   const notifyListeners = function(pinName, evt) {
      observer.notifyListeners(pinName, evt)
   }

   const addPin = function(pinName){
      //Todo: must be unique and must be string
      const pin = new Pin(pinName, addListener)
      pins[pinName] = pin
      return pin
   }

   return {
      addPin,
      addListener,
      removeListener,
      notifyListeners
   }
}
