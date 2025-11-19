import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { jikan } from '../services/jikan.js';

export default function FeedMentionPreview({ body }) {
  const query = useMemo(() => {
    if (!body) return '';
    const m = body.match(/@([\w\s]{2,})/);
    return m ? m[1].trim() : '';
  }, [body]);
  const [img, setImg] = useState(null);

  useEffect(() => {
    let active = true;
    if (!query) { setImg(null); return; }
    const run = async () => {
      try {
        const { data } = await jikan.searchAnime(query, 1, 1);
        if (!active) return;
        const first = Array.isArray(data) && data[0];
        const src = first?.images?.jpg?.image_url || first?.images?.webp?.image_url || null;
        setImg(src);
      } catch { setImg(null); }
    };
    const t = setTimeout(run, 250);
    return () => { active = false; clearTimeout(t); };
  }, [query]);

  if (!img) return null;
  return (
    <Box sx={{ mt: 1 }}>
      <img src={img} alt={query} style={{ width: 120, height: 'auto', borderRadius: 8 }} />
    </Box>
  );
}
