import _ from 'lodash'
import createObserver from './observer'
import scout from './scout'
import contextDom from './contextDom'

const defaultOptions = {
   runInitialUpdate: true,
   autoUpdate: true,
   throttleResize: null,
   throttleScroll: null,
   context: (typeof window !== 'undefined') ? contextDom : Function.prototype
}

const create = function (scene, view, options) {
   view = (_.isNil(view) && (typeof window !== 'undefined')) ? window : view
   const optns = _.assign(defaultOptions, options)
   return scout(createObserver(), view, scene, optns)
}

const version = (typeof VERSION !== 'undefined') ? VERSION : null

module.exports = {
   create,
   version
}