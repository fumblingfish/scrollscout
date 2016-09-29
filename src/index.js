import _ from 'lodash'
import observer from './observer'
import scout from './scout'
import contextDom from './contextDom'

const defaultOptions = {
   runInitialUpdate: true,
   context: (typeof window !== 'undefined') ? contextDom : Function.prototype
}

const create = function (scene, view, options) {
   view = (_.isNil(view) && (typeof window !== 'undefined')) ? window : view
   const optns = _.assign(defaultOptions, options)
   return scout(observer(), view, scene, optns)
}

const version = VERSION

module.exports = {
   create,
   version
}