import {isNumber, isString} from './common'

var parseOffset = function (offset) {
   if (offset == null) return 0
   return isString(offset) ? parseFloat(offset.match(/[-+0-9]+/g)) : parseFloat(offset)
}

export default function PinBase() {
   this._viewPosition = 0.5
   this._scenePosition = 0.5
   this._viewOffset = 0
   this._sceneOffset = 0
}
PinBase.prototype.view = function (value, offset) {
   this._viewPosition = isNumber(value) ? value : this._viewPosition
   this._viewOffset = parseOffset(offset)
   return this
}
PinBase.prototype.scene = function (value, offset) {
   this._scenePosition = isNumber(value) ? value : this._scenePosition
   this._sceneOffset = parseOffset(offset)
   return this
}
