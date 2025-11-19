import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, Stack, TextField, Button, Typography, Box } from '@mui/material';
import { threads } from '../services/threads.js';
import { useAuth } from '../context/AuthContext.jsx';
import { jikan } from '../services/jikan.js';

export default function FeedComposer({ onPosted }) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [posting, setPosting] = useState(false);

  const mentionQuery = useMemo(() => {
    const match = body.match(/@([\w\s]{2,})$/);
    return match ? match[1].trim() : '';
  }, [body]);
  const [mentionImg, setMentionImg] = useState(null);

  useEffect(() => {
    let active = true;
    if (!mentionQuery) { setMentionImg(null); return; }
    const run = async () => {
      try {
        const { data } = await jikan.searchAnime(mentionQuery, 1, 1);
        if (!active) return;
        const first = Array.isArray(data) && data[0];
        if (first) {
          const img = first.images?.jpg?.image_url || first.images?.webp?.image_url;
          setMentionImg(img || null);
        } else setMentionImg(null);
      } catch { setMentionImg(null); }
    };
    const t = setTimeout(run, 300);
    return () => { active = false; clearTimeout(t); };
  }, [mentionQuery]);

  const submit = async () => {
    if (!title.trim()) return;
    setPosting(true);
    try {
      await threads.create({ malId: 0, title: title.trim(), body });
      setTitle(''); setBody('');
      onPosted && onPosted();
    } finally { setPosting(false); }
  };

  if (!user) return null;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>Start a thread</Typography>
        <Stack spacing={1}>
          <TextField size="small" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
          <TextField multiline minRows={2} placeholder="Share something... Use @ to mention an anime" value={body} onChange={(e)=>setBody(e.target.value)} />
          {mentionImg && (
            <Box sx={{ mt: 1 }}>
              <img src={mentionImg} alt={mentionQuery} style={{ width: 120, height: 'auto', borderRadius: 8 }} />
            </Box>
          )}
          <Box>
            <Button variant="contained" disabled={posting} onClick={submit}>Post</Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
