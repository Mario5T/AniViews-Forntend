import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { jikan } from '../services/jikan.js';
import DiscussionSection from '../components/DiscussionSection.jsx';

export default function AnimeDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    jikan.getAnimeDetails(id)
      .then((d) => { if (mounted) { setData(d); setLoading(false); } })
      .catch((e) => { if (mounted) { setError(e.message || 'Error'); setLoading(false); } });
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div style={{ padding: 16 }}>Loading...</div>;
  if (error) return <div style={{ padding: 16, color: 'crimson' }}>{error}</div>;
  if (!data) return null;

  const anime = data;
  const title = anime.title || anime.title_english || anime.title_japanese;
  const img = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
  const synopsis = anime.synopsis;

  return (
    <div style={{ padding: 16, maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24 }}>
        <div>
          {img && <img src={img} alt={title} style={{ width: '100%', borderRadius: 8 }} />}
        </div>
        <div>
          <h1 style={{ marginTop: 0 }}>{title}</h1>
          {anime.score ? <div style={{ margin: '8px 0' }}>⭐ {anime.score}</div> : null}
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{synopsis}</div>
        </div>
      </div>
      <DiscussionSection malId={anime.mal_id} />
    </div>
  );
}
