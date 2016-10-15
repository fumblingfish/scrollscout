import _ from 'lodash'

function observer() {
   var listeners = [], UID = 0

   const removeEventListener = (type, cb) => {
      _.remove(listeners, listener => {
         return listener.callback === cb && listener.type === type
      })
   }

   return {

      addListener(type, callback) {
         const matchListener = listener => (listener.callback === callback && listener.type === type)
         if(_.some(listeners, matchListener)) return
         UID += 1
         var event = {id: UID, type, callback}
         listeners.push(event)
         const fn = function(){
            removeEventListener(type, event.callback)
            return event
         }
         fn._id = event.id
         return fn
      },

      removeListener: removeEventListener,

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