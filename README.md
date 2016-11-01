# scrollscout
Observe when elements enter or leave viewport.
Create custom scroll triggers, fixed or relative to element and viewport height.
Suitable for responsive/fluid or static layouts.

[Demo](https://fumblingfish.github.io/scrollscout/)

### Install
```
npm install scrollscout
```

### Setup
With ES6
```javascript
import scrollscout from 'scrollscout'
```
Without
```javascript
var scrollscout = require('scrollscout')
```

### Usage
If all you need is a quick way to detect when an element enters or leaves the viewport, see [Scrollscout built in events](#scrollscout-built-in-events).
Or add your own custom triggers to specify position, offset, direction, and axis.

### Custom triggers
```javascript
var myScrollscout = scrollscout.create(mySceneElement)

var tg = myScrollscout.addTrigger('triggerA')

tg.view(0.5)
tg.scene(0.9)

tg.subscribe(function(){
    // fires when half (0.5) of the view (viewport)
    // passes 0.9 of the scene (mySceneElement) size
    // when scrolling vertical and forward
})
```

A more convenient way would be to use **method chaining**
```javascript
myScrollscout.addTrigger('triggerA')
    .view(0.2, '100px')
    .scene(0.9)
    .backward()
    .axis('x')
    .subscribe(function () {
         // fires when 1/5 (0.2) of the view (viewport) offset by 100px
         // passes 9/10 (0.9) of the scene (mySceneElement) size
         // when scrolling horizontal and backward
    })
```
The order doesn't matter. But note that 'subscribe' must be the last in chain.

#### Simplest usage
```javascript
myScrollscout.addTrigger('triggerA').subscribe(function () {
    // fires when half of the view (viewport)
    // passes half of the scene (mySceneElement) size
    // when scrolling vertical and forward
})

```

### Position
A trigger consist of two pins. One is relative to the view (viewport) and the other to the scene (target element). Both pins are added via the `view` and `scene` methods, that each takes a position ratio and an offset value. By default the pins are placed in the center at a 0.5 ratio of the view/scene height or width. The position ratio is relative to the subject height or width. So a ratio 0 would be the top (or left side) of the view or scene. A ratio of 1 would be the bottom (or right side).

```javascript
// Here the view pin is placed 1/5 from the top of the
// viewport with an offset of 100px
tr.view(0.2, "100px")

// Here the scene pin is placed 1/10 from the bottom of the scene element
tr.scene(0.9)
```

The second argument could also be a number
```javascript
tr.view(0.2, 100).scene(0.9)
```

Example:
```javascript
trA.view(0.5)
trA.scene(0.3, '10px')

        +---------+
      +------------+
      | |         | |
      | |   trA   | <--- trA.view(0.5)
      | |         | |
      +------------+
        |         |
        +---------+
        |   trA   <--- trA.scene(0.3, '10px')
        |         |    //"offset by 10 pixels"
        +---------+
        |         |
        +---------+
```

### Direction
This controls from what direction the scene should pass in order to trigger an event.
```javascript
tr.forward() // down or right
```
```javascript
tr.backward() // up or left
```

### Axis
The axis can be set with `'x'` or `'y'`
```javascript
tr.axis('x')
```

### Unsubscribing
The subscribe method returns a function that can be used to unsubscribe.
```javascript
var unsubscribeTrigger = tr.subscribe(function(){
    // do something
})

// ...then later
unsubscribeTrigger()
```
```javascript
var unsubscribeTrigger = tr.subscribe(function(){
    // do something once
    unsubscribeTrigger()
})
```
Or you can unsubscribe from the trigger itself
```javascript
tr.unsubscribe(someHandler)
```

### Destroy
Remove trigger and unsubscribe
```javascript
tr.destroy()
```

### Debug
To help visualize what's going on use `debug`
```javascript
tr.debug()
tr.debug('cyan') // custom color
tr.debug(false) // remove debug marker. Can be toggled with true/false.
```

Debug all triggers with
```javascript
myScrollscout.debug()
```

## Create a scrollscout
To create a scrollscout use `scrollscout.create` and add the scene element. Window is the default view.

```javascript
var myWindowScrollscout = scrollscout.create(sceneElement)
```
```javascript
var myWindowScrollscout = scrollscout.create(sceneElement, options)
```
You can also supply an html element as the view

```javascript
var myElementScrollscout = scrollscout.create(sceneElement, viewElement, options)
```

Options are:
```javascript
var options = {
  runInitialUpdate: true, // Default is true
  autoUpdate: true, // Default is true
  throttleResize: 100, // Milliseconds. Default is null
  throttleScroll: 10, //  Milliseconds. Default is null
}
```

### Add trigger
When adding a trigger a name must be specified
```javascript
myScrollscout.addTrigger('triggerA')
```
##### Remove trigger
```javascript
myScrollscout.removeTrigger('triggerA')
```
##### Get trigger
```javascript
myScrollscout.getTrigger('triggerA')
```

### Start/Update/Stop
Activate and deactivate with `start` and `stop`  
```javascript
myScrollscout.start()
```
```javascript
myScrollscout.stop()
```
To force or do manual updates use `update`.
```javascript
// Force update
myScrollscout.update()
```
```javascript
// For manual update set autoUpdate to false
var myScrollscout = scrollscout.create(sceneElement, {autoUpdate:false})
myScrollscout.update()
```

### Scrollscout built in events
Use the built in methods if you just need to detect if an element enters or leaves the viewport. They are `sceneWillEnter`, `sceneWillLeave`, `sceneDidEnter`, `sceneDidLeave`. Options are `offsetTop` and `offsetBottom`.

```javascript
var myScrollscout = scrollscout.create(mySceneElement)

myScrollscout.sceneWillEnter({
      offsetTop:'10px',
      offsetBottom:'-10px'
   }).subscribe(function(){
      //...
   })
```
