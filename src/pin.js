import PinBase from './pinbase'
import {DESCEND, ASCEND, AXIS_X, AXIS_Y} from './constants'


export default function Pin(name, scoutRef) {
   this._name = name
   this._direction = DESCEND
   this._axis = AXIS_Y
   this.subscribe = (fn) => scoutRef.addListener(this._name, fn)
   this.destroy = () => scoutRef.removePin(this._name)
   this.pinChanges = scoutRef.pinChanges
   return this
}

Pin.prototype = new PinBase()

Pin.prototype.descend = function () {
   this._direction = DESCEND
   return this
}

Pin.prototype.ascend = function () {
   this._direction = ASCEND
   return this
}

Pin.prototype.axis = function (axis) {
   this._axis = ( axis === AXIS_X ) ? AXIS_X : AXIS_Y
   this.pinChanges()
   return this
}