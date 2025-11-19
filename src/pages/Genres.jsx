import React, { useEffect, useMemo, useState } from 'react';
import { jikan } from '../services/jikan.js';
import AnimeList from '../components/AnimeList.jsx';
import { Box, Chip, Typography } from '@mui/material';

export default function Genres() {
  const [genres, setGenres] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    jikan.getGenres().then(({ data }) => setGenres(data || [])).catch(()=>{});
  }, []);

  const cacheKey = useMemo(() => active ? `genre:${active}` : 'genre:none', [active]);

  return (
    <div className="container">
      <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>Genres</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.2, mb: 2 }}>
        {genres.map((g) => (
          <Chip
            key={g.mal_id}
            label={g.name}
            clickable
            color={active === String(g.mal_id) ? 'primary' : 'default'}
            onClick={() => setActive(String(g.mal_id))}
          />
        ))}
      </Box>
      {active ? (
        <AnimeList
          title={`Top in ${genres.find(x => String(x.mal_id) === active)?.name || ''}`}
          cacheKey={cacheKey}
          fetchPage={(p, l) => jikan.getAnimeByGenre(active, p, l)}
        />
      ) : (
        <Box sx={{ color: 'text.secondary' }}>Pick a genre to see top titles.</Box>
      )}
    </div>
  );
}
