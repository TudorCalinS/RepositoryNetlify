// src/App.js
import React from "react";
import "./App.css";
import Search from './components/Search';

function App() {
  return (
    <div className="App">
      <div className="uc-container">
        
        <h1 className="uc-title">🚧 Under Construction 🚧</h1>
        <div className="uc-animation">
          <div className="uc-bar"></div>
          <div className="uc-bar"></div>
          <div className="uc-bar"></div>
          
        </div>
        <p className="uc-text">We are in testing phase. Stay tuned!</p>

        <h1>Chirie Cluj pana la 500 euro</h1>
        <Search />
         
      </div>
    </div>
    
  );
}

export default App;

