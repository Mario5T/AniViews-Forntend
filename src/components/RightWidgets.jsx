import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Stack, Skeleton, Box } from '@mui/material';
import { jikan } from '../services/jikan.js';
import { Link as RouterLink } from 'react-router-dom';

let seasonCache = { key: '', data: [], ts: 0 };

function currentSeasonKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = d.getMonth();
  const s = m<=1? 'winter' : m<=4? 'spring' : m<=7? 'summer' : 'fall';
  return `${y}-${s}`;
}

export default function RightWidgets() {
  const [seasonTop, setSeasonTop] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const key = currentSeasonKey();
        const now = Date.now();
        if (seasonCache.key === key && (now - seasonCache.ts) < 10*60*1000) {
          if (!mounted) return;
          setSeasonTop(seasonCache.data);
          setLoading(false);
          return;
        }
        setLoading(true);
        const { data: seasonData } = await jikan.getSeasonalAnime(1, 25);
        if (!mounted) return;
        const sorted = (seasonData || [])
          .filter(a => typeof a.score === 'number')
          .sort((a,b) => (b.score||0) - (a.score||0))
          .slice(0, 10);
        seasonCache = { key, data: sorted, ts: now };
        setSeasonTop(sorted);
      } finally { if (mounted) setLoading(false); }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <Stack spacing={2} sx={{ position: 'sticky', top: 72 }}>
      <Card>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>Top Rated This Season</Typography>
          <Stack spacing={1}>
            {loading ? new Array(10).fill(0).map((_,i)=>(
              <Skeleton key={i} height={48} />
            )) : (
              seasonTop.map((a) => {
                const img = a.images?.jpg?.image_url || a.images?.webp?.image_url;
                return (
                  <Stack key={a.mal_id} direction="row" spacing={1} alignItems="center">
                    {img ? <img src={img} alt={a.title} width={36} height={54} style={{ objectFit:'cover', borderRadius:4 }} /> : <Box sx={{ width:36, height:54, bgcolor:'action.hover', borderRadius:1 }} />}
                    <Typography component={RouterLink} to={`/anime/${a.mal_id}`} sx={{ textDecoration:'none', color:'inherit' }} variant="body2">
                      {a.title} {typeof a.score==='number' ? `• ⭐ ${a.score}` : ''}
                    </Typography>
                  </Stack>
                );
              })
            )}
          </Stack>
          <Typography component={RouterLink} to="/simulcasts" variant="caption" sx={{ mt: 1.5, display:'inline-block' }}>View all</Typography>
        </CardContent>
      </Card>
    </Stack>
  );
}
