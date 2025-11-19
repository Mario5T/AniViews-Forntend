import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jikan } from '../services/jikan.js';
import AnimeList from '../components/AnimeList.jsx';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Search() {
  const query = useQuery();
  const navigate = useNavigate();
  const q = query.get('q') || '';
  const qpGenres = (query.get('genres') || '').split(',').filter(Boolean);
  const qpYear = query.get('year') || '';
  const qpMinScore = query.get('minScore') || '';
  const qpLimit = Number(query.get('limit') || '24');

  const [genresList, setGenresList] = useState([]);
  const [genres, setGenres] = useState(qpGenres);
  const [year, setYear] = useState(qpYear);
  const [minScore, setMinScore] = useState(qpMinScore);
  const [limit, setLimit] = useState(qpLimit);

  useEffect(() => {
    jikan.getGenres().then(({ data }) => setGenresList(data || [])).catch(()=>{});
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (genres.length) params.set('genres', genres.join(','));
    if (year) params.set('year', String(year));
    if (minScore) params.set('minScore', String(minScore));
    if (limit && limit !== 24) params.set('limit', String(limit));
    navigate({ search: params.toString() }, { replace: true });
  }, [q, genres, year, minScore, limit, navigate]);

  const cacheKey = useMemo(() => `search:${q}|g:${genres.join('-')}|y:${year}|s:${minScore}|l:${limit}`, [q, genres, year, minScore, limit]);

  return (
    <div className="container">
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Search results for: {q || '...'}</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginBottom: 12 }}>
        <label>Year
          <input value={year} onChange={(e)=>setYear(e.target.value)} placeholder="YYYY" style={{ marginLeft: 6, width: 90 }} />
        </label>
        <label>Min score
          <input value={minScore} onChange={(e)=>setMinScore(e.target.value)} placeholder="1-10" style={{ marginLeft: 6, width: 70 }} />
        </label>
        <label>Per page
          <select value={limit} onChange={(e)=>setLimit(Number(e.target.value)||24)} style={{ marginLeft: 6 }}>
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={36}>36</option>
            <option value={48}>48</option>
          </select>
        </label>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {genresList.slice(0, 18).map((g) => {
          const id = String(g.mal_id);
          const active = genres.includes(id);
          return (
            <button
              key={id}
              className={`button ${active ? '' : 'ghost'}`}
              onClick={() => setGenres(active ? genres.filter(x => x !== id) : [...genres, id])}
            >{g.name}</button>
          );
        })}
      </div>
      {q ? (
        <AnimeList
          title={`Results`}
          cacheKey={cacheKey}
          initialPageSize={limit}
          fetchPage={(p, l) => jikan.searchAnime(q, p, l, { genres: genres.join(','), minScore: minScore || undefined, year: year || undefined })}
        />
      ) : (
        <div>Type a query in the search bar.</div>
      )}
    </div>
  );
}
