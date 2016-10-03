import chai from 'chai'
import observer from '../src/observer'

const expect = chai.expect

describe('observer', function () {

   describe('addListener', function () {
      it('should add a listener', () => {
         const obs = observer()
         obs.addListener("A", ()=> {})
         expect(obs.getListeners().length).to.be.equal(1)
      })
   })

   describe('removeListener', function () {
      it('should remove listener', () => {
         const obs = observer()
         const fnA = ()=> {}
         const fnB = ()=> {}
         const fnC = ()=> {}
         obs.addListener("A", fnA)
         obs.addListener("B", fnB)
         const idC = obs.addListener("C", fnC)
         idC()
         const actual = (obs.getListeners()[0].type === "A" && obs.getListeners()[1].type === "B")
         expect(actual).to.be.equal(true)
         obs.removeListener(fnA)
         obs.removeListener(fnB)
         expect(obs.getListeners().length).to.be.equal(0)
      })
   })

   // describe('removeListenerById', function () {
   //    it('should remove listener by id', () => {
   //       const obs = observer()
   //       const fn = obs.addListener("A", ()=> {})
   //       obs.removeListenerById(fn._id)
   //       expect(obs.getListeners().length).to.be.equal(0)
   //    })
   // })

   describe('removeAllListeners', function () {
      it('should remove all listeners', () => {
         const obs = observer()
         obs.addListener("A", ()=> {})
         obs.addListener("B", ()=> {})
         obs.removeAllListeners()
         expect(obs.getListeners().length).to.be.equal(0)
      })
   })

   describe('notifyListeners', function () {
      it('should notify listeners', () => {
         var obs = observer()
         var value = 0
         var idA = obs.addListener("A", () => {
            value = value + 1
         })
         var idB = obs.addListener("A", () => {
            value = value + 1
         })
         expect(value).to.be.equal(0)
         obs.notifyListeners('A', {})
         expect(value).to.be.equal(2)
         idA()
         obs.notifyListeners('A', {})
         expect(value).to.be.equal(3)
         idB()
         obs.notifyListeners('A', {})
         expect(value).to.be.equal(3)
      })
   })

   describe('uniqueTypesSubscribed', function () {
      it('should return reduced list with only unique types', () => {
         var obs = observer()
         obs.addListener("A", () => {})
         obs.addListener("A", () => {})
         obs.addListener("B", () => {})
         var actual = obs.uniqueTypesSubscribed()
         var expected = ["A", "B"]
         expect(expected).to.deep.equal(actual)
      })
   })

})