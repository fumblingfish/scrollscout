import {DESCEND, ASCEND} from './constants'
export const nextDescendPrev = (pv, ps, nv, ns) => (pv < ps) && (nv >= ns)
export const nextAscendPrev = (pv, ps, nv, ns) => (pv > ps) && (nv <= ns)

export const directionPredicates = {
   [DESCEND]: nextDescendPrev,
   [ASCEND]: nextAscendPrev,
}