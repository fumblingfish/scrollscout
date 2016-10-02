import React, {Component} from 'react';
import cx from 'classnames'
import scrollscout from 'scrollscout'

import './Demo.css';

require('rc-slider/assets/index.css');

import Slider from 'rc-slider';
import Cube from './Cube.js';

const aPositionSize = 40
const bPositionSize = 30

const aOffsetSize = -200
const bOffsetSize = 200

const colorOff = '#AA41B2'
const colorOn = '#5683FF'
const pinConfig = {
   A: {insideFrame: true, debugColor: colorOn},
   B: {insideFrame: false, debugColor: colorOff},
   C: {insideFrame: false, debugColor: colorOff},
   D: {insideFrame: true, debugColor: colorOn},
}


const POSITION = 'position'
const OFFSET = 'offset'

const interpolate = function (xs, ys) {
   const x1 = xs[0]
   const y1 = ys[0]
   const x2 = xs[1]
   const y2 = ys[1]
   return (x) => y1 + (y2 - y1) * ((x - x1) / (x2 - x1))
}

export const positionCalc = interpolate([0, 100], [aPositionSize, bPositionSize])
export const offsetCalc = interpolate([0, 100], [aOffsetSize, bOffsetSize])

const defaultConfig = {
   positionValue: 50,
   offsetValue: 50,
   subscribedPins: {
      A: true,
      B: true,
      C: true,
      D: true
   },
   slide: POSITION,
}

class Demo extends Component {


   constructor(props) {
      super(props)
      this.state = {
         insideFrame: false,
         ...defaultConfig,
         resetActive: false,
      }
      this._unsubscribe = {}
   }

   componentDidMount() {
      const view = Modernizr.touchevents ? this.refs.view : window
      const scene = this.refs.scene
      this._scrollScout = scrollscout.create(scene, view)

      this._pins = {
         A: this._scrollScout.addPin('pinA ON')
            .scene(1)
            .backward(),
         B: this._scrollScout.addPin('pinB OFF')
            .scene(1)
            .forward(),
         C: this._scrollScout.addPin('pinC OFF')
            .scene(0)
            .backward(),
         D: this._scrollScout.addPin('pinD ON')
            .scene(0)
            .forward(),
      }

      Object.keys(this.state.subscribedPins).forEach((key)=> {
         if (this.state.subscribedPins[key] === true) {
            this._subscribe(key)
         }
      })

      setTimeout(() => {
         this._updatePinsPosition(this.state.positionValue)
         this._updatePinsOffsets(this.state.offsetValue)
         this._scrollScout.start()
      }, 100)
   }

   componentWillReceiveProps(nextProps){
      if(nextProps.active){
         Object.keys(this.state.subscribedPins).forEach((key)=> {
          this._pins[key].debug(pinConfig[key].debugColor)
         })
      }else{
         this._reset()
         Object.keys(this.state.subscribedPins).forEach((key)=> {
            this._pins[key].debug(false)
         })
      }
      this._updateScrollScout()
   }

   _togglePinSubscription(pinKey) {
      const {subscribedPins} = this.state
      this.setState({
         subscribedPins: {
            ...subscribedPins,
            [pinKey]: !subscribedPins[pinKey]
         },
         resetActive: true
      })
      if (!subscribedPins[pinKey]) {
         this._subscribe(pinKey)
      } else {
         this._unsubcribe(pinKey)
      }
      this._updateScrollScout()
   }

   _updatePosition(value) {
      this.setState({
         positionValue: value,
         resetActive: true
      })
      this._updatePinsPosition(value)
   }

   _updateOffset(value) {
      this.setState({
         offsetValue: value,
         resetActive: true
      })
      this._updatePinsOffsets(value)

   }

   _updatePinsPosition(value) {
      const pins = this._pins
      const layoutValue = positionCalc(value)
      const ratio = layoutValue / 100
      pins.C.view(1 - ratio)
      pins.B.view(ratio)
      pins.A.view(ratio)
      pins.D.view(1 - ratio)
      this._updateScrollScout()
   }

   _updatePinsOffsets(value) {
      const pins = this._pins
      const layoutValue = offsetCalc(value)
      pins.A.view(null, layoutValue)
      pins.B.view(null, layoutValue)
      pins.C.view(null, layoutValue)
      pins.D.view(null, layoutValue)
      this._updateScrollScout()

   }

   _subscribe(pinKey) {
      this._unsubscribe[pinKey] = this._pins[pinKey].subscribe(() => this.setState({insideFrame: pinConfig[pinKey].insideFrame}))
      if (this.props.active) {
         this._pins[pinKey].debug(pinConfig[pinKey].debugColor)
      }
   }

   _unsubcribe(pinKey) {
      this._pins[pinKey].debug(false)
      this._unsubscribe[pinKey]()
      this._updateScrollScout()
   }

   _updateScrollScout() {
      this._scrollScout.update()
   }

   _reset() {
      this.setState({
         ...defaultConfig,
         resetActive: false,
      }, ()=> {
         this._updatePinsPosition(this.state.positionValue)
         this._updatePinsOffsets(this.state.offsetValue)
         Object.keys(this.state.subscribedPins).forEach((key)=> {
            if (this.state.subscribedPins[key] === true) {
               this._subscribe(key)
            }
         })
         this._scrollScout.update()
      })
   }

   _toggleSlideControls(value) {
      this.setState({
         slide: value
      })
   }

   _renderSliders() {
      const {positionValue, offsetValue, slide} = this.state
      if (!this.props.active) return null
      return (
         <div className="slider-container" style={{left: '20%', right: '20%'}}>
            {slide === POSITION &&
            <Slider className="scrollscout-slider"
                    tipFormatter={null}
                    min={0}
                    max={100}
                    value={positionValue}
                    onChange={(value)=>this._updatePosition(value)}
                    allowCross={false}
            />}

            {slide === OFFSET &&
            <Slider className="scrollscout-slider"
                    tipFormatter={null}
                    min={0}
                    max={100}
                    value={offsetValue}
                    onChange={(value)=>this._updateOffset(value)}
                    allowCross={false}
            />}
            <div className="slider-controls">
               <button className={cx('btn', {'active': slide === POSITION})}
                       onClick={()=>this._toggleSlideControls(POSITION)}>POSITION
               </button>
               <button className={cx('btn', {'active': slide === OFFSET})}
                       onClick={()=>this._toggleSlideControls(OFFSET)}>OFFSET
               </button>
            </div>
         </div>
      )
   }


   _renderInactiveMessage(){
      return (
         <div className="monitor__inner">
            <dev className={cx("monitor__note")}>
               <p>Observe when elements enter or leave viewport.</p>
               <p>Create custom triggers, fixed or relative to element and viewport height.</p>
            </dev>
         </div>
      )
   }

   _renderActiveMessage(){
      return (
         <div className="monitor__inner">
            <dev className={cx("monitor__note")}>
               <p>Scroll and resize</p>
            </dev>
         </div>
      )
   }


   render() {

      const {positionValue, offsetValue, insideFrame, subscribedPins, slide, resetActive, showValues} = this.state
      const {active} = this.props
      const positionLayoutValue = positionCalc(positionValue)
      const offsetLayoutValue = offsetCalc(offsetValue)
      const marginSize = `${positionLayoutValue}%`
      const value = positionLayoutValue / 100
      const pinTopRatio = Math.round(value * 100) / 100
      const pinBottomRatio = Math.round(100 - value * 100) / 100
      const monitorStyle = {top: marginSize, bottom: marginSize}
      const pinOffsetPx = `${Math.round(offsetLayoutValue)}px`
      const positionCodeTop = <span className={cx({'hl': slide === POSITION})}>{pinTopRatio}</span>
      const positionCodeBottom = <span className={cx({'hl': slide === POSITION})}>{pinBottomRatio}</span>
      const offsetCode = <span className={cx({'hl': slide === OFFSET})}>{pinOffsetPx}</span>
      const offsetGuideStyle = {transform: `translateY(${pinOffsetPx})`}

      const showCodeExA = this.props.active && subscribedPins.A
      const showCodeExB = this.props.active && subscribedPins.B
      const showCodeExC = this.props.active && subscribedPins.C
      const showCodeExD = this.props.active && subscribedPins.D

      return (
         <div className={cx('demo', {'monitor-active': insideFrame})} ref="view">
            <div className="monitor-background" style={monitorStyle}></div>

            <div className="page">
               <div className="scene" ref="scene">
                  <Cube animate={insideFrame}/>
               </div>
            </div>

            <footer className="footer" style={{height: marginSize}}>

               {this._renderSliders()}

               {active && (
                  <div className="controls controls--subscribe">
                     <button className={cx('btn btn-subscribe--a', {'active': subscribedPins.A})}
                             onClick={()=>this._togglePinSubscription('A')}>A
                     </button>
                     <button className={cx('btn btn-subscribe--b', {'active': subscribedPins.B})}
                             onClick={()=>this._togglePinSubscription('B')}>B
                     </button>
                     <button className={cx('btn btn-subscribe--c', {'active': subscribedPins.C})}
                             onClick={()=>this._togglePinSubscription('C')}>C
                     </button>
                     <button className={cx('btn btn-subscribe--d', {'active': subscribedPins.D})}
                             onClick={()=>this._togglePinSubscription('D')}>D
                     </button>
                  </div>
               )}
               {active && (
                  <div className="controls controls--reset">
                     <button className={cx('btn', {'active': resetActive})} onClick={()=>this._reset()}>RESET</button>
                  </div>

               )}

            </footer>
            <div className="monitor" style={monitorStyle}>
               {offsetValue !== 50 && <div className="offset-guide offset-guide--top" style={offsetGuideStyle}></div>}
               {offsetValue !== 50 &&
               <div className="offset-guide offset-guide--bottom" style={offsetGuideStyle}></div>}

               {!active && this._renderInactiveMessage()}
               {active && this._renderActiveMessage()}

               { showCodeExA && (
                  <div className="code-ex code-ex--a" style={{color: colorOn}}>
                        <pre>
                           <span
                              className="code-ex__line"><span>pinA.view(</span>{positionCodeTop}<span>,</span>"{offsetCode}")</span>
                           <span className="code-ex__line"><span>    .scene(1)</span></span>
                           <span className="code-ex__line"><span>    .backward()</span></span>
                        </pre>
                  </div>
               )}

               { showCodeExB && (
                  <div className="code-ex code-ex--b" style={{color: colorOff}}>
                        <pre>
                           <span
                              className="code-ex__line"><span>pinB.view(</span>{positionCodeTop}<span>,</span>"{offsetCode}")</span>
                           <span className="code-ex__line"><span>    .scene(1)</span></span>
                           <span className="code-ex__line"><span>    .forward()</span></span>
                        </pre>
                  </div>
               )}

               { showCodeExC && (
                  <div className="code-ex code-ex--c" style={{color: colorOff}}>
                        <pre>
                           <span
                              className="code-ex__line"><span>pinC.view(</span>{positionCodeBottom}<span>,</span>"{offsetCode}")</span>
                           <span className="code-ex__line"><span>    .scene(0)</span></span>
                           <span className="code-ex__line"><span>    .backward()</span></span>
                        </pre>
                  </div>
               )}

               { showCodeExD && (
                  <div className="code-ex code-ex--d" style={{color: colorOn}}>
                        <pre>
                           <span
                              className="code-ex__line"><span>pinD.view(</span>{positionCodeBottom}<span>,</span>"{offsetCode}")</span>
                           <span className="code-ex__line"><span>    .scene(0)</span></span>
                           <span className="code-ex__line"><span>    .forward()</span></span>
                        </pre>
                  </div>
               )}


            </div>
         </div>
      );
   }
}

export default Demo;
