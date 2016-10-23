import chai from 'chai'
import scrollscout from '../src'
import {
   someAxis,
   targetPointPair,
   notificationOrder,
   passesForward,
   passesBackward,
   triggerObj
} from '../src/scout'
import {AXIS_X, AXIS_Y} from '../src/constants'
import Trigger from '../src/trigger'

const expect = chai.expect

const forward = function (pT, nT) {
   return passesForward(pT[0], pT[1], nT[0], nT[1])
}

const backward = function (pT, nT) {
   return passesBackward(pT[0], pT[1], nT[0], nT[1])
}

describe('scout', function () {

   describe('addTrigger', function () {
      it('should return a new trigger', () => {
         const sc = scrollscout.create()
         const trg = sc.addTrigger('A')
         expect(trg).to.be.an.instanceof(Trigger)
      })

      it('should return same trigger if trigger already exists', () => {
         const sc = scrollscout.create()
         const a1 = sc.addTrigger('A')
         const a2 = sc.addTrigger('A')
         expect(a1).to.deep.equal(a2)
      })

      it('should return false if no trigger name is passed', () => {
         const sc = scrollscout.create()
         const a1 = sc.addTrigger()
         expect(a1).to.be.equal(false)
         const a2 = sc.addTrigger({})
         expect(a2).to.be.equal(false)
      })

   })

   describe('getTrigger', function () {
      it('should return trigger by name', () => {
         const sc = scrollscout.create()
         sc.addTrigger('A')
         const trg = sc.getTrigger('A')
         expect(trg._name).to.be.equal('A')
      })
   })

   describe('removeTrigger', function () {
      it('should remove a trigger', () => {
         const sc = scrollscout.create()
         sc.addTrigger('A')
         sc.addTrigger('B')
         sc._addListener('A', () => {})
         sc._addListener('A', () => {})
         sc._addListener('B', () => {})
         sc.removeTrigger('A')
         const allListeners = sc._getListeners()
         expect(allListeners.length).to.be.equal(1)
      })

      it('should unsubscribe trigger subscribers', () => {
         const sc = scrollscout.create()
         sc.addTrigger('A')
         sc.removeTrigger('A')
         const trg = sc.getTrigger('A')
         expect(trg).to.be.undefined
      })

   })

   describe('_notifyListeners', function () {
      it('should notify subscribers', () => {
         var value = 0
         const sc = scrollscout.create()
         const trg = sc.addTrigger('A')
         trg.subscribe(() => value++)
         sc._notifyListeners('B')
         expect(value).to.be.equal(0)
         sc._notifyListeners('A')
         expect(value).to.be.equal(1)
      })

      it('should notify listeners', () => {
         var value = 0
         const sc = scrollscout.create()
         sc.addTrigger('A')
         sc._addListener('A', () => value++)
         sc._notifyListeners('B')
         expect(value).to.be.equal(0)
         sc._notifyListeners('A')
         expect(value).to.be.equal(1)
      })
   })


   describe('_addListeners', function () {
      it('should add listeners and return unsubscriber function', () => {
         var value = 0, unsub
         const sc = scrollscout.create()
         sc.addTrigger('A')
         unsub = sc._addListener('A', () => value++)
         sc._notifyListeners('A')
         expect(value).to.be.equal(1)
         unsub()
         sc._notifyListeners('A')
         expect(value).to.be.equal(1)
      })
   })

   describe('removeListeners', function () {
      it('should remove a listener', () => {
         var value = 0
         const fnA = () => value = value + 1
         const fnB = () => value = value + 1
         const sc = scrollscout.create()
         sc.addTrigger('A')
         sc._addListener('A', fnA)
         sc._addListener('A', fnB)
         sc._notifyListeners('A')
         expect(value).to.be.equal(2)
         sc._removeListener('A', fnA)
         sc._notifyListeners('A')
         expect(value).to.be.equal(3)
      })
   })

   describe('someAxis', function () {
      it('should check if there are any subscriptions to a given axis', () => {
         var expectedX, expectedY
         const sc = scrollscout.create()
         const someAxisX = someAxis(AXIS_X)
         const someAxisY = someAxis(AXIS_Y)
         const trgA = sc.addTrigger('A').axis('x')
         const trgB = sc.addTrigger('B').axis('y')
         const trgC = sc.addTrigger('C').axis('y')

         const triggers = {'A': trgA, 'B': trgB, 'C': trgC,}
         const listeners1 = [{type: 'A'}, {type: 'B'}, {type: 'C'}]
         expectedX = someAxisX(listeners1, triggers)
         expectedY = someAxisY(listeners1, triggers)
         expect(expectedX).to.be.equal(true)
         expect(expectedY).to.be.equal(true)

         const listeners2 = [{type: 'B'}, {type: 'C'}]
         expectedX = someAxisX(listeners2, triggers)
         expectedY = someAxisY(listeners2, triggers)
         expect(expectedX).to.be.equal(false)
         expect(expectedY).to.be.equal(true)

         expectedX = someAxisX([], triggers)
         expectedY = someAxisY([], triggers)
         expect(expectedX).to.be.equal(false)
         expect(expectedY).to.be.equal(false)

      })
   })

   describe('targetPointPair', function () {
      it('should return a pair of two targePoints [view, scene]', () => {
         var stateA = [
            [1, 4],
            [2, 4]
         ]
         var actual, trg = {
            _view: {
               position: 0.5,
               offset: 0
            },
            _scene: {
               position: 0.5,
               offset: 0
            }
         }
         actual = targetPointPair(stateA[0], stateA[1], trg)
         expect(actual).to.deep.equal([3, 4])
         trg = {
            _view: {
               position: 0.5,
               offset: 0
            },
            _scene: {
               position: 0,
               offset: 0
            }
         }
         actual = targetPointPair(stateA[0], stateA[1], trg)
         expect(actual).to.deep.equal([3, 2])
      })
   })


   const A = [1, 2]
   const B = [2, 2]
   const C = [3, 2]
   const D = [0, 0]

   describe('passesForward', function () {
      it('should return true if view targetpoint passes scene target point forward', () => {
         expect(forward(A, B)).to.be.equal(true)
         expect(forward(B, C)).to.be.equal(false)
         expect(forward(C, B)).to.be.equal(false)
         expect(forward(B, A)).to.be.equal(false)
         expect(forward(A, C)).to.be.equal(true)
         expect(forward(C, A)).to.be.equal(false)
         expect(forward(D, D)).to.be.equal(false)
      })
   })

   describe('passesBackward', function () {
      it('should return true if view targetpoint is passes scene target point backward', () => {
         expect(backward(A, B)).to.be.equal(false)
         expect(backward(B, C)).to.be.equal(false)
         expect(backward(C, B)).to.be.equal(true)
         expect(backward(B, A)).to.be.equal(false)
         expect(backward(A, C)).to.be.equal(false)
         expect(backward(C, A)).to.be.equal(true)
         expect(backward(D, D)).to.be.equal(false)
      })
   })


   const getOrderedTriggers = (triggers) => notificationOrder(triggers.map(triggerObj))

   describe('notificationOrder', function () {
      it('should return notificationList in right order ', () => {
         var resolvedTriggersToNotify, orderedPair
         resolvedTriggersToNotify = [{
            pT: [140, 240],
            nT: [302, 240],
            trigger: {_name: 'A1', _direction: 'forward'}
         },
            {
               pT: [200, 256],
               nT: [370, 256],
               trigger: {_name: 'B1', _direction: 'forward'}
            }]
         orderedPair = getOrderedTriggers(resolvedTriggersToNotify)
         expect(orderedPair[0].trigger._name === 'B1').to.be.equal(true)

         resolvedTriggersToNotify = [{
            pT: [216, 250],
            nT: [328, 250],
            trigger: {_name: 'A2', _direction: 'forward'}
         },
            {
               pT: [284, 300],
               nT: [312, 300],
               trigger: {_name: 'B2', _direction: 'forward'}
            }]
         orderedPair = getOrderedTriggers(resolvedTriggersToNotify)
         expect(orderedPair[0].trigger._name === 'A2').to.be.equal(true)

         resolvedTriggersToNotify = [{
            pT: [370, 240],
            nT: [328, 240],
            trigger: {_name: 'A3b', _direction: 'backward'}
         },
            {
               pT: [302, 256],
               nT: [140, 256],
               trigger: {_name: 'B3b', _direction: 'backward'}
            }]
         orderedPair = getOrderedTriggers(resolvedTriggersToNotify)
         expect(orderedPair[0].trigger._name === 'B3b').to.be.equal(true)

         resolvedTriggersToNotify = [{
            pT: [325, 250],
            nT: [179, 300],
            trigger: {_name: 'B4b', _direction: 'backward'}
         },
            {
               pT: [265, 230],
               nT: [151, 280],
               trigger: {_name: 'A4b', _direction: 'backward'}
            }]
         orderedPair = getOrderedTriggers(resolvedTriggersToNotify)
         expect(orderedPair[0].trigger._name === 'A4b').to.be.equal(true)

      })
   })
})