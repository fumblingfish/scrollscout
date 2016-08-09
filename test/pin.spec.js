import chai from 'chai'
import scrollscout from '../src'
import Pin from '../src/pin'

const expect = chai.expect

describe('pin', function () {

   describe('addPin', function() {
      it('should subscribe and unsubscribe', () => {
         var value = 0
         const sc = scrollscout.create()
         const pin = sc.addPin('A')
         const unsub = pin.subscribe(() => value++)
         sc.notifyListeners('A')
         expect(value).to.be.equal(1)
         unsub()
         sc.notifyListeners('A')
         expect(value).to.be.equal(1)
      })
   })





})