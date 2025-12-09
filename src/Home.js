// src/pages/Home.js
import React from "react";
import "./App.css"; // păstrează stilurile de bază și adaugă noile clase

export default function Home() {
  return (
    <div className="uc-fullscreen">
      <div className="uc-container">
        <h1 className="uc-title">🚧 Under Construction 🚧</h1>

        <div className="uc-animation">
          <div className="uc-bar"></div>
          <div className="uc-bar"></div>
          <div className="uc-bar"></div>
        </div>

        <p className="uc-text">
          Will be back soon!
        </p>

        <p className="uc-text">
          Contact:{" "}
          <a href="mailto:calintudorsuciu@gmail.com" className="uc-mail">
            calintudorsuciu@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
