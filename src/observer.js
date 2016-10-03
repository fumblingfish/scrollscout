import _ from 'lodash'

function observer() {
   var listeners = [], UID = 0

   const removeEventListener = (cb) => {
      listeners = _.filter(listeners, listener => listener.callback !== cb)
   }

   return {

      addListener(type, callback) {
         UID += 1
         var event = {id: UID, type, callback}
         listeners.push(event)
         const fn = function(){
            removeEventListener(event.callback)
            return event
         }
         fn._id = event.id
         return fn
      },

      removeListener(cb) {
         return removeEventListener(cb)
      },

      removeAllListeners() {
         listeners = []
      },

      getListeners() {
         return listeners
      },

      notifyListeners(type, evt) {
         _.forEach(listeners, (listener) => {
            if (listener.type === type) {
               listener.callback(evt)
            }
         })
      },

      uniqueTypesSubscribed() {
         const types = _.map(listeners, (e) => {
            return e.type
         })
         return _.reduce(types, (acc, next) => {
            if (acc.indexOf(next) !== -1) return acc
            acc.push(next)
            return acc
         }, [])
      },

   }
}

export default observer