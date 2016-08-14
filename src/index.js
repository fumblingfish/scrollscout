import observer from './observer'
import scout from './scout'
import inputEnvDom from './inputEnvDom'

var defaultInputEnv = Function.prototype

if (typeof window !== 'undefined') {
   defaultInputEnv = inputEnvDom
}

const create = function (scene, options, inputEnvPlugin) {
   const inputEnv = inputEnvPlugin ? inputEnvPlugin : defaultInputEnv
   return scout(observer(), options, inputEnv(scene))
}

module.exports = {create}