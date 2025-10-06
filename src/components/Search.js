// src/components/Search.js
import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';

// Folosește propriile tale chei Algolia
const searchClient = algoliasearch(
  'TCTLP8TOBS',       // Înlocuiește cu App ID-ul tău
  '9bd990d39a63306983a0b1ddc6b754cc'    // Înlocuiește cu Search-Only Key
);

// Componenta pentru afișarea fiecărei proprietăți
const Hit = ({ hit }) => (
  <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
    <strong>{hit.tip} - {hit.camere} camere</strong>
    <p>{hit.oras} - {hit.cartier}</p>
    <p>Preț: {hit.pret} {hit.moneda}</p>
    <p>{hit.descriere}</p>
  </div>
);

// Componenta principală Search
const Search = () => {
  return (
    <div>
      <h2>Caută proprietăți</h2>
      <InstantSearch searchClient={searchClient} indexName="proprietati">
        <SearchBox translations={{ placeholder: 'Caută după oraș, cartier sau camere...' }} />
        <Hits hitComponent={Hit} />
      </InstantSearch>
    </div>
  );
};

export default Search;
