export const hasValue = (obj, value) => {
   return Object.keys(obj).reduce((acc, key) => {
      if (acc) return acc
      return obj[key] === value
   }, false)
}

export const validateCustomEvents = (evtList, evtType) => {
   return Object.keys(evtList).reduce((acc, key) => {
      if (acc) return acc
      return evtList[key].eventName === evtType
   }, false)
}

export const filterOverKeyValue = (obj, arr) => {
   return arr.reduce((acc, key) => {
      if(!obj[key]) return acc
      return [].concat(acc, [obj[key]])
   }, [])
}

export const isNumber = (obj) => Object.prototype.toString.call(obj) == '[object Number]'
export const isString = (obj) => Object.prototype.toString.call(obj) == '[object String]'
