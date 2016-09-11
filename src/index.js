import _ from 'lodash'
import observer from './observer'
import scout from './scout'
import contextDom from './contextDom'

const defaultOptions = {
   runInitialUpdate: true,
   context: (typeof window !== 'undefined') ? contextDom : Function.prototype
}

const create = function (view, scene, options) {
   const optns = _.assign(defaultOptions, options)
   return scout(observer(), view, scene, optns)
}

module.exports = {create}