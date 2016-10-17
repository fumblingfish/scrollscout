import chai from 'chai'
import scrollscout from '../src'
import createObserver from '../src/observer'
import scoutEvents from '../src/scoutEvents'

const expect = chai.expect



describe('scoutEvents', function () {

   describe('subscribe', function () {
      it('should add a listener and recieve notifications from observer', () => {
         let value = 0
         const sc = scrollscout.create()
         const observer = createObserver()
         const on = scoutEvents(sc, observer)
         on.sceneDidEnter().subscribe(function(){
            value = value + 1
         })
         on.sceneDidEnter().subscribe(function(){
            value = value + 1
         })
         observer.notifyListeners('__EVT_sceneDidEnter_1')
         expect(value).to.be.equal(1)
      })
   })

   describe('unsubscribe', function () {
      it('should remove listener from observer', () => {
         let value = 0
         const sc = scrollscout.create()
         const observer = createObserver()
         const on = scoutEvents(sc, observer)
         const handler = ()=>{value = value + 1}
         const sceneEnterA = on.sceneDidEnter()
         sceneEnterA.subscribe(handler)
         sceneEnterA.subscribe(handler)
         observer.notifyListeners('__EVT_sceneDidEnter_2')
         expect(value).to.be.equal(1)

         value = 0
         const sceneEnterB = on.sceneDidEnter()
         const sceneEnterC = on.sceneDidEnter()
         sceneEnterB.subscribe(handler)
         const unsubC = sceneEnterC.subscribe(handler)
         unsubC()
         observer.notifyListeners('__EVT_sceneDidEnter_3')
         expect(value).to.be.equal(1)
      })

   })

})