import observer from './observer'
import scout from './scout'


const create = function(scene, options){
   return new scout(observer(), scene, options)
}

module.exports = { create }