import chai from 'chai'
import scrollscout from '../src'
import Pin from '../src/pin'

const expect = chai.expect

describe('scout', function () {

   describe('addPin', function() {
      it('should return a new pin', () => {
         const sc = scrollscout.create()
         const pin = sc.addPin('A')
         expect(pin).to.be.an.instanceof(Pin)
      })
   })

   describe('notifyListeners', function() {
      it('should notify subscribers', () => {
         var value = 0
         const sc = scrollscout.create()
         const pin = sc.addPin('A')
         pin.subscribe(() => value++)
         sc.notifyListeners('B')
         expect(value).to.be.equal(0)
         sc.notifyListeners('A')
         expect(value).to.be.equal(1)
      })

      it('should notify listeners', () => {
         var value = 0
         const sc = scrollscout.create()
         sc.addPin('A')
         sc.addListener('A', () => value++)
         sc.notifyListeners('B')
         expect(value).to.be.equal(0)
         sc.notifyListeners('A')
         expect(value).to.be.equal(1)
      })
   })


   describe('addListeners', function() {
      it('should add listeners and return unsubscriber', () => {
         var value = 0, unsub
         const sc = scrollscout.create()
         sc.addPin('A')
         unsub = sc.addListener('A', () => value++)
         sc.notifyListeners('A')
         expect(value).to.be.equal(1)
         unsub()
         sc.notifyListeners('A')
         expect(value).to.be.equal(1)
      })
   })

   describe('removeListeners', function() {
      it('should remove a listener', () => {
         var value = 0
         const fn = () => value++
         const sc = scrollscout.create()
         sc.addPin('A')
         var unsub = sc.addListener('A', fn)
         sc.notifyListeners('A')
         expect(value).to.be.equal(1)
         sc.removeListener(unsub)
         sc.notifyListeners('A')
         expect(value).to.be.equal(1)
      })
   })

})