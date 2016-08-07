

function observer() {
   var listeners = [], GUI = 0

   const removeEventListener = (evt) => {
      listeners = listeners.filter(listener => listener.id !== evt.id)
      return evt
   }

   return {

      addListener(type, callback){
         GUI += 1
         var event = {id:GUI, type, callback}
         listeners.push(event)
         return () => removeEventListener(event)
      },

      removeListener(removeListenerFn) {
         return removeListenerFn()
      },

      removeAllListeners: function () {
         listeners = []
      },

      getListeners() {
         return listeners
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