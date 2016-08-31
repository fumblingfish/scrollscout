# scrollscout


### Usage
```
var myScrollScout = scrollscout.create(window, mySceneElement)
 
myScrollScout.addPin('pinA')
    .view(0.5)
    .scene(0.9)
    .forward()
    .axis('x')
    .subscribe(function () {
         // fires when half (0.5) of the view (window) 
         // passes 0.9 of the scene (mySceneElement) size
         // when scrolling horizontal
    })
    
myScrollScout.run()
```

### Simplest usage
```
myScrollScout.addPin('pinA').subscribe(function () {
    // fires when half of the view (window) 
    // passes half of the scene (mySceneElement) size
    // when scrolling vertical
})

myScrollScout.run()
```