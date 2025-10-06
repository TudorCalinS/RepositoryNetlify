// src/components/Search.js
import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';

const searchClient = algoliasearch(
  'ALGOLIA_APP_ID',       // înlocuiește cu App ID-ul tău
  'ALGOLIA_SEARCH_KEY'    // înlocuiește cu Search-Only Key
);

const Hit = ({ hit }) => (
  <div>
    <strong>{hit.tip} {hit.camere} camere</strong>
    <p>{hit.oras} - {hit.cartier} - {hit.pret} {hit.moneda}</p>
  </div>
);

const Search = () => {
  return (
    <InstantSearch searchClient={searchClient} indexName="proprietati">
      <SearchBox />
      <Hits hitComponent={Hit} />
    </InstantSearch>
  );
};

export default Search;
