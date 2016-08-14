import chai from 'chai'
import scrollscout from '../src'
import { someAxis, targetPointPair } from '../src/scout'
import {AXIS_X, AXIS_Y} from '../src/constants'
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

   describe('getPin', function() {
      it('should return by name', () => {
         const sc = scrollscout.create()
         sc.addPin('A')
         const pin = sc.getPin('A')
         expect(pin._name).to.be.equal('A')
      })
   })

   describe('removePin', function() {
      it('should remove a Pin', () => {
         const sc = scrollscout.create()
         sc.addPin('A')
         sc.addListener('A', () => {})
         sc.addListener('A', () => {})
         sc.addListener('B', () => {})
         sc.removePin('A')
         const allListeners = sc.getListeners()
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

   describe('someAxis', function() {
      it('should check if there are any subscriptions to a given axis', () => {
         var expectedX, expectedY
         const sc = scrollscout.create()
         const someAxisX = someAxis(AXIS_X)
         const someAxisY = someAxis(AXIS_Y)
         const pinA = sc.addPin('A').axis('x')
         const pinB = sc.addPin('B').axis('y')
         const pinC = sc.addPin('C').axis('y')

         const pins = {'A': pinA, 'B': pinB, 'C': pinC,}
         const listeners1 = [{type:'A'}, {type:'B'}, {type:'C'}]
         expectedX = someAxisX(listeners1, pins)
         expectedY = someAxisY(listeners1, pins)
         expect(expectedX).to.be.equal(true)
         expect(expectedY).to.be.equal(true)

         const listeners2 = [{type:'B'}, {type:'C'}]
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

   describe('targetPointPair', function() {
      it('should return a pair of two targePoints [view, scene]', () => {
         var stateA = [
            [1, 4],
            [2, 4]
         ]
         var actual, pin
         const offsetZero = {_viewOffset:0, _sceneOffset:0}
         pin = { _viewPosition:0.5, _scenePosition:0.5, ...offsetZero}
         actual = targetPointPair(stateA[0], stateA[1], pin)
         expect(actual).to.deep.equal([3, 4])

         pin = { _viewPosition:0.5, _scenePosition:0, ...offsetZero}
         actual = targetPointPair(stateA[0], stateA[1], pin)
         expect(actual).to.deep.equal([3, 2])
      })
   })



})