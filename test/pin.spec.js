import scrollscout from '../src/'
import Pin from '../src/pin'

import chai from 'chai'

const expect = chai.expect

const dummyScoutRef = {
   pinChanges: () => {}
}

const pinViewSceneTest = function (method) {

   const prop = `_${method}`

   const pinA = new Pin('A', dummyScoutRef)[method](0.5)
   expect(pinA[prop].position).to.be.equal(0.5)
   expect(pinA[prop].offset).to.be.equal(0)

   const pinB = new Pin('B', dummyScoutRef)[method](1, 100)
   expect(pinB[prop].position).to.be.equal(1)
   expect(pinB[prop].offset).to.be.equal(100)
   //
   const pinC = new Pin('C', dummyScoutRef)[method](1, '100px')
   expect(pinC[prop].position).to.be.equal(1)
   expect(pinC[prop].offset).to.be.equal(100)

   const pinD = new Pin('D', dummyScoutRef)[method](undefined, undefined)
   expect(pinD[prop].position).to.be.equal(0.5)
   expect(pinD[prop].offset).to.be.equal(0)
}


describe('pin', function () {

   describe('subscribe', function () {
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


   describe('destroy', function () {
      it('should remove and delete pin from scout and unsubscribe listeners"', () => {
         var value = 0
         const sc = scrollscout.create()
         const pin = sc.addPin('TO_BE_DESTROYED')
         pin.subscribe(() => value++)
         pin.destroy()
         sc.notifyListeners('TO_BE_DESTROYED')
         const pinRemoved = sc.getPin('TO_BE_DESTROYED')
         expect(value).to.be.equal(0)
         expect(pinRemoved).to.be.undefined
      })
   })

   describe('axis', function () {
      it('should apply axis "x" or "y"', () => {
         const pinA = new Pin('A', dummyScoutRef).axis()
         const pinB = new Pin('B', dummyScoutRef).axis('xyz')
         const pinC = new Pin('C', dummyScoutRef).axis('x')
         expect(pinA._axis).to.be.equal('y')
         expect(pinB._axis).to.be.equal('y')
         expect(pinC._axis).to.be.equal('x')
      })
   })

   describe('view', function () {
      it('should set a ratio and an offset as string or number', () => {
         pinViewSceneTest('view')
      })
   })

   describe('scene', function () {
      it('should set a ratio and an offset as string or number', () => {
         pinViewSceneTest('scene')
      })
   })


})