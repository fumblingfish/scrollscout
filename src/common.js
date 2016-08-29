export const filterOverKeyValue = (obj, arr) => {
   return arr.reduce((acc, key) => {
      if (!obj[key]) return acc
      return [].concat(acc, [obj[key]])
   }, [])
}

export const unique = function (list) {
   return function (value, index) {
      return (list.indexOf(value) === index)
   }
}

export const any = function (fn, arr) {
   return arr.reduce((acc, next) => {
      if(acc === true) return
      return fn(next)
   }, false)
}


export const isNumber = (obj) => Object.prototype.toString.call(obj) == '[object Number]'
export const isString = (obj) => Object.prototype.toString.call(obj) == '[object String]'
