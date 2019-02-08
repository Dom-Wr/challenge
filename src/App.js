import React, { Component } from 'react';
import logo from './HEB_logo.svg';
import './App.scss';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <div class="mdc-text-field">
            <input type="text" id="my-text-field" class="mdc-text-field__input"/>
            <label class="mdc-floating-label" for="my-text-field">Hint text</label>
            <div class="mdc-line-ripple"></div>
        </div>
      </div>
    );
  }
}
    
export default App;
