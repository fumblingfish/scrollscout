import PinBase from './pinbase'
import {DESCEND, ASCEND, AXIS_X, AXIS_Y} from './constants'


class Pin extends PinBase{
   constructor(name, scoutRef) {
      super()
      this._name = name
      this._direction = DESCEND
      this._axis = AXIS_Y
      this.subscribe = (fn) => scoutRef.addListener(this._name, fn)
      this.destroy = () => scoutRef.removePin(this._name)
      this.pinChanges = scoutRef.pinChanges
      return this
   }

   descend() {
      this._direction = DESCEND
      return this
   }

   ascend() {
      this._direction = ASCEND
      return this
   }

   axis(axis) {
      this._axis = ( axis === AXIS_X ) ? AXIS_X : AXIS_Y
      this.pinChanges()
      return this
   }
}

export default Pin