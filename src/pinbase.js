import {isNumber, isString} from './common'

var parseOffset = function (offset) {
   if (offset == null) return 0
   return isString(offset) ? parseFloat(offset.match(/[-+0-9]+/g)) : parseFloat(offset)
}


class PinBase {
   constructor() {
      this._view = {
         position: 0.5,
         offset: 0
      }
      this._scene = {
         position: 0.5,
         offset: 0
      }
   }

   view(value, offset) {
      this._view.position = isNumber(value) ? value : this._view.position
      this._view.offset = parseOffset(offset)
      return this
   }

   scene(value, offset) {
      this._scene.position = isNumber(value) ? value : this._scene.position
      this._scene.offset = parseOffset(offset)
      return this
   }
}

export default PinBase
