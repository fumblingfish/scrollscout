import PinBase from './pinbase'
import {FORWARD, BACKWARD, AXIS_X, AXIS_Y} from './constants'


class Pin extends PinBase {
   constructor(name, scoutRef) {
      super()
      this._name = name
      this._direction = FORWARD
      this._axis = AXIS_Y
      this._debug = false
      this._pinChanges = scoutRef.pinChanges
      this.subscribe = (fn) => scoutRef.addListener(this._name, fn)
      this.destroy = () => scoutRef.removePin(this._name)
      return this
   }

   forward() {
      this._direction = FORWARD
      this._pinChanges()
      return this
   }

   backward() {
      this._direction = BACKWARD
      this._pinChanges()
      return this
   }

   view(value, offset) {
      super.view(value, offset)
      this._pinChanges()
      return this
   }

   scene(value, offset) {
      super.scene(value, offset)
      this._pinChanges()
      return this
   }

   axis(axis) {
      this._axis = ( axis === AXIS_X ) ? AXIS_X : AXIS_Y
      this._pinChanges()
      return this
   }

   debug(value) {
      this._debug = (typeof value === 'undefined' || value !== false)
      this._debugColor = (typeof value !== 'undefined' && value !== false && value !== true) ? value : undefined
      this._pinChanges()
      return this
   }
}

export default Pin