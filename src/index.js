import observer from './observer'
import scout from './scout'
import contextDom from './contextDom'

var defaultContext = Function.prototype

if (typeof window !== 'undefined') {
   defaultContext = contextDom
}

const create = function (scene, options, userContext) {
   const context = userContext ? userContext : defaultContext
   return scout(observer(), options, context(scene))
}

module.exports = {create}