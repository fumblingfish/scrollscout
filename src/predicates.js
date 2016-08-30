import {FORWARD, BACKWARD} from './constants'

export const nextDescendPrev = (pv, ps, nv, ns) => (pv < ps) && (nv >= ns)
export const nextAscendPrev = (pv, ps, nv, ns) => (pv > ps) && (nv <= ns)

export const directionPredicates = {
   [FORWARD]: nextDescendPrev,
   [BACKWARD]: nextAscendPrev,
}