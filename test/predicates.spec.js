import chai from 'chai'
import { nextDescendPrev, nextAscendPrev } from '../src/predicates'

const expect = chai.expect

const descend = function (pT, nT) {
   return nextDescendPrev(pT[0], pT[1], nT[0], nT[1])
}

const ascends = function (pT, nT) {
   return nextAscendPrev(pT[0], pT[1], nT[0], nT[1])
}

describe('predicates', function () {

   const A = [1, 2]
   const B = [2, 2]
   const C = [3, 2]
   const D = [0, 0]

   describe('nextDescendPrev', function() {
      it('should return true if view targetpoint is descending scene target point', () => {
         expect( descend(A, B) ).to.be.equal(true)
         expect( descend(B, C) ).to.be.equal(false)
         expect( descend(C, B) ).to.be.equal(false)
         expect( descend(B, A) ).to.be.equal(false)
         expect( descend(A, C) ).to.be.equal(true)
         expect( descend(C, A) ).to.be.equal(false)
         expect( descend(D, D) ).to.be.equal(false)
      })
   })

   describe('nextAscendPrev', function() {
      it('should return true if view targetpoint is ascending scene target point', () => {
         expect( ascends(A, B) ).to.be.equal(false)
         expect( ascends(B, C) ).to.be.equal(false)
         expect( ascends(C, B) ).to.be.equal(true)
         expect( ascends(B, A) ).to.be.equal(false)
         expect( ascends(A, C) ).to.be.equal(false)
         expect( ascends(C, A) ).to.be.equal(true)
         expect( ascends(D, D) ).to.be.equal(false)
      })
   })
})