import chai from 'chai'
import scrollscout from '../src'
import {
   someAxis,
   targetPointPair,
   notificationOrder,
   passesForward,
   passesBackward,
   pinDetails
} from '../src/scout'
import {AXIS_X, AXIS_Y} from '../src/constants'
import Pin from '../src/pin'

const expect = chai.expect

const forward = function (pT, nT) {
   return passesForward(pT[0], pT[1], nT[0], nT[1])
}

const backward = function (pT, nT) {
   return passesBackward(pT[0], pT[1], nT[0], nT[1])
}

describe('scout', function () {

   describe('addPin', function () {
      it('should return a new pin', () => {
         const sc = scrollscout.create()
         const pin = sc.addPin('A')
         expect(pin).to.be.an.instanceof(Pin)
      })

      it('should return same pin if pin already exists', () => {
         const sc = scrollscout.create()
         const a1 = sc.addPin('A')
         const a2 = sc.addPin('A')
         expect(a1).to.deep.equal(a2)
      })

      it('should return false if no pin name is passed', () => {
         const sc = scrollscout.create()
         const a1 = sc.addPin()
         expect(a1).to.be.equal(false)
         const a2 = sc.addPin({})
         expect(a2).to.be.equal(false)
      })

   })

   describe('getPin', function () {
      it('should return pin by name', () => {
         const sc = scrollscout.create()
         sc.addPin('A')
         const pin = sc.getPin('A')
         expect(pin._name).to.be.equal('A')
      })
   })

   describe('removePin', function () {
      it('should remove a Pin', () => {
         const sc = scrollscout.create()
         sc.addPin('A')
         sc.addPin('B')
         sc._addListener('A', () => {})
         sc._addListener('A', () => {})
         sc._addListener('B', () => {})
         sc.removePin('A')
         const allListeners = sc._getListeners()
         expect(allListeners.length).to.be.equal(1)
      })

      it('should unsubscribe pin subscribers', () => {
         const sc = scrollscout.create()
         sc.addPin('A')
         sc.removePin('A')
         const pin = sc.getPin('A')
         expect(pin).to.be.undefined
      })

   })

   describe('_notifyListeners', function () {
      it('should notify subscribers', () => {
         var value = 0
         const sc = scrollscout.create()
         const pin = sc.addPin('A')
         pin.subscribe(() => value++)
         sc._notifyListeners('B')
         expect(value).to.be.equal(0)
         sc._notifyListeners('A')
         expect(value).to.be.equal(1)
      })

      it('should notify listeners', () => {
         var value = 0
         const sc = scrollscout.create()
         sc.addPin('A')
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
         sc.addPin('A')
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
         const fn = () => value++
         const sc = scrollscout.create()
         sc.addPin('A')
         var unsub = sc._addListener('A', fn)
         sc._notifyListeners('A')
         expect(value).to.be.equal(1)
         sc._removeListener(unsub)
         sc._notifyListeners('A')
         expect(value).to.be.equal(1)
      })
   })

   describe('someAxis', function () {
      it('should check if there are any subscriptions to a given axis', () => {
         var expectedX, expectedY
         const sc = scrollscout.create()
         const someAxisX = someAxis(AXIS_X)
         const someAxisY = someAxis(AXIS_Y)
         const pinA = sc.addPin('A').axis('x')
         const pinB = sc.addPin('B').axis('y')
         const pinC = sc.addPin('C').axis('y')

         const pins = {'A': pinA, 'B': pinB, 'C': pinC,}
         const listeners1 = [{type: 'A'}, {type: 'B'}, {type: 'C'}]
         expectedX = someAxisX(listeners1, pins)
         expectedY = someAxisY(listeners1, pins)
         expect(expectedX).to.be.equal(true)
         expect(expectedY).to.be.equal(true)

         const listeners2 = [{type: 'B'}, {type: 'C'}]
         expectedX = someAxisX(listeners2, pins)
         expectedY = someAxisY(listeners2, pins)
         expect(expectedX).to.be.equal(false)
         expect(expectedY).to.be.equal(true)

         expectedX = someAxisX([], pins)
         expectedY = someAxisY([], pins)
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
         var actual, pin
         pin = {
            _view: {
               position: 0.5,
               offset: 0
            },
            _scene: {
               position: 0.5,
               offset: 0
            }
         }
         actual = targetPointPair(stateA[0], stateA[1], pin)
         expect(actual).to.deep.equal([3, 4])
         pin = {
            _view: {
               position: 0.5,
               offset: 0
            },
            _scene: {
               position: 0,
               offset: 0
            }
         }
         actual = targetPointPair(stateA[0], stateA[1], pin)
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


   const getOrderedPins = (pins) => notificationOrder(pins.map(pinDetails))

   describe('notificationOrder', function () {
      it('should return notificationList in right order ', () => {
         var resolvedPinsToNotify, orderedPair
         resolvedPinsToNotify = [{
            pT: [140, 240],
            nT: [302, 240],
            pin: {_name: 'A1', _direction: 'forward'}
         },
            {
               pT: [200, 256],
               nT: [370, 256],
               pin: {_name: 'B1', _direction: 'forward'}
            }]
         orderedPair = getOrderedPins(resolvedPinsToNotify)
         expect(orderedPair[0].pin._name === 'B1').to.be.equal(true)

         resolvedPinsToNotify = [{
            pT: [216, 250],
            nT: [328, 250],
            pin: {_name: 'A2', _direction: 'forward'}
         },
            {
               pT: [284, 300],
               nT: [312, 300],
               pin: {_name: 'B2', _direction: 'forward'}
            }]
         orderedPair = getOrderedPins(resolvedPinsToNotify)
         expect(orderedPair[0].pin._name === 'A2').to.be.equal(true)

         resolvedPinsToNotify = [{
            pT: [370, 240],
            nT: [328, 240],
            pin: {_name: 'A3b', _direction: 'backward'}
         },
            {
               pT: [302, 256],
               nT: [140, 256],
               pin: {_name: 'B3b', _direction: 'backward'}
            }]
         orderedPair = getOrderedPins(resolvedPinsToNotify)
         expect(orderedPair[0].pin._name === 'B3b').to.be.equal(true)

         resolvedPinsToNotify = [{
            pT: [325, 250],
            nT: [179, 300],
            pin: {_name: 'B4b', _direction: 'backward'}
         },
            {
               pT: [265, 230],
               nT: [151, 280],
               pin: {_name: 'A4b', _direction: 'backward'}
            }]
         orderedPair = getOrderedPins(resolvedPinsToNotify)
         expect(orderedPair[0].pin._name === 'A4b').to.be.equal(true)

      })
   })
})