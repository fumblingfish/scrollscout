const EVT = '__EVT'

class ScoutEvent {

   static UID = 0

   constructor(_name, _observer){
      this.id = ScoutEvent.UID++
      this.nameId = `${EVT}_${_name}_${this.id}`
      this.observer = _observer
   }

   _handler(evt){
      return this.observer.notifyListeners(this.id, evt)
   }

   _addPins(pins){
      this.pins = pins
      this.pins.forEach((pin)=>{
         pin.subscribe((evt) => this._handler(evt))
      })
   }

   subscribe(fn){
      return this.observer.addListener(this.nameId , fn)
   }

   unsubscribe(fn){
      return this.observer.removeListener(this.nameId, fn)
   }

   destroy(){
      this.pins.forEach((pin)=>{
         pin.destroy()
      })
   }
}


export default function(scout, observer){

   return {
      sceneWillEnter(obj = {}){
         const scoutEvt = new ScoutEvent('sceneWillEnter', observer)
         scoutEvt._addPins([
            scout.addPin(`${scoutEvt.nameId}_fromBottom`).view(1, obj.offsetBottom).scene(0).forward(),
            scout.addPin(`${scoutEvt.nameId}_fromTop`).view(0, obj.offsetTop).scene(1).backward()
         ])
         return scoutEvt
      },
      sceneDidEnter(obj = {}){
         const scoutEvt = new ScoutEvent('sceneDidEnter', observer)
         scoutEvt._addPins([
            scout.addPin(`${scoutEvt.nameId}_fromBottom`).view(1, obj.offsetBottom).scene(1).forward(),
            scout.addPin(`${scoutEvt.nameId}_fromTop`).view(0, obj.offsetTop).scene(0).backward()
         ])
         return scoutEvt
      },
      sceneWillLeave(obj = {}){
         const scoutEvt = new ScoutEvent('sceneWillLeave', observer)
         scoutEvt._addPins([
            scout.addPin(`${scoutEvt.nameId}_fromTop`).view(0, obj.offsetTop).scene(0).forward(),
            scout.addPin(`${scoutEvt.nameId}_fromBottom`).view(1, obj.offsetBottom).scene(1).backward()
         ])
         return scoutEvt
      },
      sceneDidLeave(obj = {}){
         const scoutEvt = new ScoutEvent('sceneDidLeave', observer)
         scoutEvt._addPins([
            scout.addPin(`${scoutEvt.nameId}_fromTop`).view(0, obj.offsetTop).scene(1).forward(),
            scout.addPin(`${scoutEvt.nameId}_fromBottom`).view(1, obj.offsetBottom).scene(0).backward()
         ])
         return scoutEvt
      }
   }

}
