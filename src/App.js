// src/App.js
import React from "react";
import "./App.css";
import Search from './components/Search';

function App() {
  return (
    <div className="App">
      <div className="uc-container">
        <h1>Proprietăți propr.ro</h1>
        <Search />
        <h1 className="uc-title">🚧 Under Construction 🚧</h1>
        <div className="uc-animation">
          <div className="uc-bar"></div>
          <div className="uc-bar"></div>
          <div className="uc-bar"></div>
        </div>
        <p className="uc-text">We are building something awesome. Stay tuned!</p>
      </div>
    </div>
    
  );
}

export default App;

