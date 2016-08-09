import PinBase from './pinbase'
import { DESCEND } from './constants'

export default function Pin(name, addListener){
   this.name = name
   this.direction = DESCEND
   this.position = [0.5, 0.5]
   this.offsets = [0, 0]
   this.subscribe = (fn) => addListener(this.name, fn)
   return this
}

Pin.prototype = new PinBase()

Pin.prototype.descend = function(){
   this.direction = 'descend'
   return this
}

Pin.prototype.ascend = function(){
   this.direction = 'ascend'
   return this
}