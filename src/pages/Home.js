// src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";

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

      <Link to="/search">
        <button className="btn-go-search">Caută anunțuri</button>
      </Link>
    </div>
  );
}
