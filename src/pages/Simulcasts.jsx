import React from 'react';
import AnimeList from '../components/AnimeList.jsx';
import { jikan } from '../services/jikan.js';
import { Box, Select, MenuItem, Typography } from '@mui/material';

const seasons = ['winter','spring','summer','fall'];

function getDefaultSeasonYear(){
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const s = m<=1? 'winter' : m<=4? 'spring' : m<=7? 'summer' : 'fall';
  return { season: s, year: y };
}

export default function Simulcasts() {
  const def = getDefaultSeasonYear();
  const [season, setSeason] = React.useState(def.season);
  const [year, setYear] = React.useState(def.year);

  return (
    <div className="container">
      <Box sx={{ display:'flex', alignItems:'center', gap:2, mb:2 }}>
        <Typography variant="h5" fontWeight={800}>Simulcasts</Typography>
        <Box sx={{ ml:'auto', display:'flex', gap:1.5, alignItems:'center' }}>
          <Select size="small" value={season} onChange={(e)=>setSeason(e.target.value)}>
            {seasons.map(s=> <MenuItem key={s} value={s}>{s[0].toUpperCase()+s.slice(1)}</MenuItem>)}
          </Select>
          <Select size="small" value={String(year)} onChange={(e)=>setYear(Number(e.target.value))}>
            {Array.from({ length: (new Date().getFullYear() - 1990 + 1) }, (_, i) => (new Date().getFullYear() - i))
              .map(y => <MenuItem key={y} value={String(y)}>{y}</MenuItem>)}
          </Select>
        </Box>
      </Box>
      <AnimeList
        title={`${season[0].toUpperCase()+season.slice(1)} ${year}`}
        fetchPage={(p, l) => jikan.getSeason(year, season, p, l)}
        cacheKey={`season:${season}:${year}`}
      />
    </div>
  );
}
