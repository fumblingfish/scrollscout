import scrollscout from '../src/'
import Trigger from '../src/trigger'

import chai from 'chai'

const expect = chai.expect

const dummyScoutRef = {
   _triggerChange: Function.prototype
}

const triggerViewSceneTest = function (method) {

   const prop = `_${method}`

   const triggerA = new Trigger('A', dummyScoutRef)[method](0.5)
   expect(triggerA[prop].position).to.be.equal(0.5)
   expect(triggerA[prop].offset).to.be.equal(0)

   const triggerB = new Trigger('B', dummyScoutRef)[method](1, 100)
   expect(triggerB[prop].position).to.be.equal(1)
   expect(triggerB[prop].offset).to.be.equal(100)

   const triggerC = new Trigger('C', dummyScoutRef)[method](1, '100px')
   expect(triggerC[prop].position).to.be.equal(1)
   expect(triggerC[prop].offset).to.be.equal(100)

   const triggerD = new Trigger('D', dummyScoutRef)[method](undefined, undefined)
   expect(triggerD[prop].position).to.be.equal(0.5)
   expect(triggerD[prop].offset).to.be.equal(0)
}

describe('trigger', function () {

   describe('subscribe', function () {

      it('should subscribe and unsubscribe with return function', () => {
         var value = 0
         const sc = scrollscout.create()
         const trg = sc.addTrigger('A')
         const unsub = trg.subscribe(() => value++)
         trg.subscribe(() => value++)
         sc._notifyListeners('A')
         expect(value).to.be.equal(2)
         unsub()
         sc._notifyListeners('A')
         expect(value).to.be.equal(3)
      })

      it('should subscribe and unsubscribe', () => {
         var value = 0
         const sc = scrollscout.create()
         const trg = sc.addTrigger('A')
         const fn = () => value++
         trg.subscribe(fn)
         sc._notifyListeners('A')
         expect(value).to.be.equal(1)
         trg.unsubscribe(fn)
         sc._notifyListeners('A')
         expect(value).to.be.equal(1)
      })
   })

   describe('destroy', function () {
      it('should remove and delete trigger from scout and unsubscribe listeners"', () => {
         var value = 0
         const sc = scrollscout.create()
         const trg = sc.addTrigger('TO_BE_DESTROYED')
         trg.subscribe(() => value++)
         trg.destroy()
         sc._notifyListeners('TO_BE_DESTROYED')
         const trgRemoved = sc.getTrigger('TO_BE_DESTROYED')
         expect(value).to.be.equal(0)
         expect(trgRemoved).to.be.undefined
      })
   })

   describe('axis', function () {
      it('should apply axis "x" or "y"', () => {
         const triggerA = new Trigger('A', dummyScoutRef).axis()
         const triggerB = new Trigger('B', dummyScoutRef).axis('xyz')
         const triggerC = new Trigger('C', dummyScoutRef).axis('x')
         expect(triggerA._axis).to.be.equal('y')
         expect(triggerB._axis).to.be.equal('y')
         expect(triggerC._axis).to.be.equal('x')
      })
   })

   describe('view', function () {
      it('should set a ratio and an offset as string or number', () => {
         triggerViewSceneTest('view')
      })
   })

   describe('scene', function () {
      it('should set a ratio and an offset as string or number', () => {
         triggerViewSceneTest('scene')
      })
   })

   describe('debug', function () {
      it('should set _debug to true if value is undefined or true', () => {
         const trigger = new Trigger('A', dummyScoutRef).debug()
         expect(trigger._debug).to.be.equal(true)
         trigger.debug(false)
         expect(trigger._debug).to.be.equal(false)
         trigger.debug()
         expect(trigger._debug).to.be.equal(true)
      })
   })

})