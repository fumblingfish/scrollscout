import React  from 'react';
import cx from 'classnames'

import './Cube.css'
const Cube = function({size=50, animate=false}){
   const sizehalf = size/2
   const cubeContainerStyle =  {transform: `translateY(${-sizehalf}px)`}
   const faceSize = {height:size,width:size}
   const face1Style = {transform: `translateZ(${sizehalf}px)`, ...faceSize}
   const face2Style = {transform: `rotateY(90deg) translateZ(${sizehalf}px)`, ...faceSize}
   const face3Style = {transform: `rotateY(180deg) translateZ(${sizehalf}px)`, ...faceSize}
   const face4Style = {transform: `rotateY(-90deg) translateZ(${sizehalf}px)`, ...faceSize}
   const face5Style = {transform: `rotateX(-90deg) translateZ(${sizehalf}px) rotate(180deg)`, ...faceSize}
   const face6Style = {transform: `rotateX(90deg) translateZ(${sizehalf}px)`, ...faceSize}
   return (
      <div className={'cube-container'} style={cubeContainerStyle}>
      <div className={cx('cube', {'animate':animate})} style={faceSize}>
      <div className="face" style={face1Style}><div className="face__inner"></div></div>
      <div className="face" style={face2Style}><div className="face__inner"></div></div>
      <div className="face" style={face3Style}><div className="face__inner"></div></div>
      <div className="face" style={face4Style}><div className="face__inner"></div></div>
      <div className="face" style={face5Style}><div className="face__inner"></div></div>
      <div className="face" style={face6Style}><div className="face__inner"></div></div>
      </div>
      </div>
)
}

export default Cube;
