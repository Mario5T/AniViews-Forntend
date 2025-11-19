import React, { useEffect, useState } from 'react';
import { recommendations } from '../services/recommendations.js';
import { useToast } from '../components/Toast.jsx';
import { Typography } from '@mui/material';
import { jikan } from '../services/jikan.js';
import AnimeCard from '../components/AnimeCard.jsx';

export default function Recommendations() {
  const { show } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    recommendations.mine()
      .then((res) => { if (mounted) { setItems(res.recommendations || []); setLoading(false); } })
      .catch((e) => { if (mounted) { show(e.message || 'Error', 'error'); setLoading(false); } });
    return () => { mounted = false; };
  }, [show]);
  useEffect(() => {
    let mounted = true;
    const run = async () => {
      const ids = (items || []).map(x => x.malId).filter(Boolean).slice(0, 12);
      if (!ids.length) { setDetails([]); return; }
      setLoadingDetails(true);
      try {
        const out = await Promise.all(ids.map(async (id) => {
          try { const data = await jikan.getAnimeDetails(id); return data; }
          catch { return null; }
        }));
        if (!mounted) return;
        setDetails(out.filter(Boolean));
      } finally { if (mounted) setLoadingDetails(false); }
    };
    run();
    return () => { mounted = false; };
  }, [items]);

  return (
    <div className="container">
      <h2>Recommended for you</h2>
      {loading ? 'Loading...' : (
        details.length ? (
          <div className="grid">
            {details.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        ) : (
          loadingDetails ? 'Loading...' : <div>No recommendations yet.</div>
        )
      )}
    </div>
  );
}
