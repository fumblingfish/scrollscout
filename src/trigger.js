import Pins from './pins'
import {FORWARD, BACKWARD, AXIS_X, AXIS_Y} from './constants'



class Trigger extends Pins {
   constructor(name, scout) {
      super()
      this._name = name
      this._direction = FORWARD
      this._axis = AXIS_Y
      this._debug = false
      this._triggerChange = scout._triggerChange
      this.subscribe = (fn) => {
         return scout._addListener(this._name, fn)
      }
      this.unsubscribe = (fn) => {
         return scout._removeListener(this._name, fn)
      }
      this.destroy = () => scout.removeTrigger(this._name)
      return this
   }

   forward() {
      this._direction = FORWARD
      this._triggerChange()
      return this
   }

   backward() {
      this._direction = BACKWARD
      this._triggerChange()
      return this
   }

   view(position, offset) {
      super.view(position, offset)
      this._triggerChange()
      return this
   }

   scene(position, offset) {
      super.scene(position, offset)
      this._triggerChange()
      return this
   }

   axis(axis) {
      this._axis = ( axis === AXIS_X ) ? AXIS_X : AXIS_Y
      this._triggerChange()
      return this
   }

   debug(value) {
      this._debug = (typeof value === 'undefined' || value !== false)
      this._debugColor = (typeof value !== 'undefined' && value !== false && value !== true) ? value : undefined
      this._triggerChange()
      return this
   }
}

export default Trigger