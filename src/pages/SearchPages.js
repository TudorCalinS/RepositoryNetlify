import React from "react";
import Search from "../components/Search"; // sau calea corectă către componenta ta

export default function SearchPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Caută anunțuri</h1>
      <Search />
    </div>
  );
}
