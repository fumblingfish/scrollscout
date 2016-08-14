function observer() {
   var listeners = [], GUI = 0

   const removeEventListener = (id) => {
      listeners = listeners.filter(listener => listener.id !== id)
      return id
   }

   return {

      addListener(type, callback) {
         GUI += 1
         var event = {id: GUI, type, callback}
         listeners.push(event)
         const fn = function(){
            removeEventListener(event.id)
            return event
         }
         fn._id = event.id
         return fn
      },

      removeListener(removeListenerFn) {
         return removeListenerFn()
      },

      removeListenerById(id) {
         return removeEventListener(id)
      },

      removeAllListeners() {
         listeners = []
      },

      getListeners() {
         return listeners
      },

      notifyListeners(type, evt) {
         listeners.forEach((listener) => {
            if (listener.type === type) {
               listener.callback(evt)
            }
         })
      },

      uniqueTypesSubscribed() {
         const types = listeners.map((e) => {
            return e.type
         })
         return types.reduce((acc, next) => {
            if (acc.indexOf(next) !== -1) return acc
            acc.push(next)
            return acc
         }, [])
      },

   }
}

export default observer