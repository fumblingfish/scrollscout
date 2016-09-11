import _ from 'lodash'

export const filterOverKeyValue = (obj, arr) => {
   return _.reduce(arr, (acc, key) => {
      if (!obj[key]) return acc
      return [].concat(acc, [obj[key]])
   }, [])
}

export const unique = function (list) {
   return function (value, index) {
      return (list.indexOf(value) === index)
   }
}

