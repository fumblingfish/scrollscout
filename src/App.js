import React, {Component} from 'react';
import scrollscout from 'scrollscout';

import './App.css';
import Logo from './Logo'
import Demo from './Demo'
import './modernizr'

class App extends Component {

   constructor(props) {
      super(props)
      this.state = {
         demoActive: false,
      }

      document.documentElement.addEventListener('touchstart', function (event) {
         if (event.touches.length > 1) {
            event.preventDefault();
         }
      }, false);
   }

   render() {

      const demoText = this.state.demoActive ? 'Hide demo' : 'Show demo'

      return (
         <div className="app">
            <header className="appheader">
               <div className="appheader__scoutlogo-container">
                  <Logo />
                  <nav className="navigation">
                     <a className="btn-outline" href="https://github.com/fumblingfish/scrollscout">Github</a>
                     <a className="btn-outline" onClick={()=> {
                        this.setState({
                           demoActive: !this.state.demoActive
                        })
                     }}>{demoText}</a>
                  </nav>
               </div>
            </header>
            <Demo active={this.state.demoActive} onActivate={(value)=> {
               this.setState({
                  demoActive: value
               })
            }}/>
            { !this.state.demoActive && (
               <footer className="appfooter">version: <span className="hl"> {scrollscout.version}</span></footer>
            )}

         </div>
      );
   }
}

export default App;
