import React from 'react';
import AnimeList from '../components/AnimeList.jsx';
import { jikan } from '../services/jikan.js';

export default function TopRated() {
  return (
    <div className="container">
      <AnimeList title="Highest Rated" fetchPage={(p, l) => jikan.getTopAnime(p, l)} cacheKey="top-rated" />
    </div>
  );
}
