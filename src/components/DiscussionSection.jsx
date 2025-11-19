import React, { useEffect, useState } from 'react';
import { threads } from '../services/threads.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Box, Button, Card, CardActionArea, CardContent, Grid, Stack, TextField, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function DiscussionSection({ malId }) {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await threads.listForAnime(malId);
      setList(res);
    } catch (e) {
      // noop - could toast
    } finally { setLoading(false); }
  };

  const onCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setCreating(true);
    try {
      await threads.create({ malId: Number(malId), title: title.trim(), body });
      setTitle(''); setBody('');
      await load();
    } catch (e) {
      // noop - could toast
    } finally { setCreating(false); }
  };

  useEffect(() => { load(); }, [malId]);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>Discussions</Typography>
      {user && (
        <Box component="form" onSubmit={onCreate} sx={{ mb: 2 }}>
          <Stack spacing={1}>
            <TextField size="small" label="Start a new thread" placeholder="Thread title" value={title} onChange={(e)=>setTitle(e.target.value)} />
            <TextField multiline minRows={2} label="Body (optional)" value={body} onChange={(e)=>setBody(e.target.value)} />
            <Box>
              <Button type="submit" variant="contained" disabled={creating}>Create Thread</Button>
            </Box>
          </Stack>
        </Box>
      )}
      {loading ? (
        <Typography variant="body2" color="text.secondary">Loading threads...</Typography>
      ) : (
        <Grid container spacing={2}>
          {list.map((t) => (
            <Grid item xs={12} key={t._id}>
              <Card>
                <CardActionArea component={RouterLink} to={`/threads/${t._id}`}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={700}>{t.title}</Typography>
                    <Typography variant="caption" color="text.secondary">{new Date(t.updatedAt).toLocaleString()} • {t.commentsCount || 0} comments</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
          {!list.length && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">No threads yet. Be the first to start a discussion.</Typography>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
}
