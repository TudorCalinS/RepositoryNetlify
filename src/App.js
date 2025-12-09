// src/App.js
import React from "react";
import Home from "./pages/Home";
import "./App.css";

function App() {
  // Variabila pentru a controla temporar Under Construction
  const underConstruction = true;

  return (
    <>
      {underConstruction ? (
        <Home /> // afișează Under Construction pe tot site-ul
      ) : (
        // aici poți reactiva router-ul când site-ul va fi live
        <div>
          {/* Exemplu de routing normal */}
          {/* <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
            </Routes>
          </Router> */}
        </div>
      )}
    </>
  );
}

export default App;
