import React, { Component } from 'react';

import Landing from './landing/landing';
import logo from './img/midi5pin.svg';
import './css/reset.css';

class App extends Component {
  render() {
    return (
        <div>
            <Landing />
        </div>
    );
  }
}

export default App;
