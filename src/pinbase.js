import { isNumber, isString } from './common'

var parseOffset = function(offset){
   if (offset == null) return 0
   return isString(offset) ? parseFloat(offset.match(/[-+0-9]+/g)) : parseFloat(offset)
}

export default function PinBase(){
   this.position = [0.5, 0.5]
   this.offsets = [0, 0]
}
PinBase.prototype.view = function(value, offset){
   this.position[0] = isNumber(value) ? value : this.position[0]
   this.offsets[0] = parseOffset(offset)
   return this
}
PinBase.prototype.scene = function(value, offset){
   this.position[1] = isNumber(value) ? value : this.position[1]
   this.offsets[1] = parseOffset(offset)
   return this
}
