import React, { Component } from 'react';
import { MainRoutes } from '../mainRoutes.js';
import '../css/App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <MainRoutes />
      </div>
    );
  }
}

export default App;
