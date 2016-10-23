import _ from 'lodash'

const exists = _.negate(_.isNil)

var parseOffset = function (offset) {
   return _.isString(offset) ? parseFloat(offset.match(/[-+0-9]+/g)) : parseFloat(offset)
}

class Marker {
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

   view(position, offset) {
      this._view.position = (exists(position) && _.isNumber(position)) ? position : this._view.position
      this._view.offset = exists(offset) ? parseOffset(offset) : this._view.offset
      return this
   }

   scene(position, offset) {
      this._scene.position =  (exists(position) && _.isNumber(position)) ? position : this._scene.position
      this._scene.offset = exists(offset) ? parseOffset(offset) : this._scene.offset
      return this
   }
}


export default Marker
