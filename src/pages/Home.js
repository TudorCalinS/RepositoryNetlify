// src/pages/Home.js
import React from "react";
import Search from "../components/Search";

export default function Home() {
  return (
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
  );
}
