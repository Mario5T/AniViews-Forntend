import React from 'react';
import { Box, Typography, Button, Card, CardActionArea, CardContent, Avatar, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FeedComposer from '../components/FeedComposer.jsx';
import { threads } from '../services/threads.js';
import FeedMentionPreview from '../components/FeedMentionPreview.jsx';

export default function Home() {
  const [items, setItems] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [hasNext, setHasNext] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const load = async (p=1, reset=false) => {
    setLoading(true);
    try {
      const res = await threads.feed({ page: p, limit: 10 });
      setItems(reset ? (res.threads||[]) : [...items, ...(res.threads||[])]);
      setHasNext(Boolean(res?.pagination?.has_next_page));
      setPage(p);
    } finally { setLoading(false); }
  };

  React.useEffect(() => { load(1, true); }, []);

  return (
    <Box>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>Followers Feed</Typography>
      <FeedComposer onPosted={() => load(1, true)} />
      <Box sx={{ display:'grid', gap: 2 }}>
        {items.map((t) => (
          <Card key={t._id}>
            <CardActionArea component={RouterLink} to={`/threads/${t._id}`}>
              <CardContent>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                  <Avatar
                    component={RouterLink}
                    to={`/users/${t.user?._id || t.user}`}
                    onClick={(e)=>e.stopPropagation()}
                    sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}
                  >{(t.user?.username || t.user?.email || 'U').slice(0,1).toUpperCase()}</Avatar>
                  <Box>
                    <Typography component={RouterLink} to={`/users/${t.user?._id || t.user}`} onClick={(e)=>e.stopPropagation()} variant="subtitle2" fontWeight={800} sx={{ textDecoration: 'none', color: 'text.primary' }}>
                      {t.user?.username || t.user?.email || 'User'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">{new Date(t.updatedAt).toLocaleString()}</Typography>
                  </Box>
                </Stack>
                <Typography variant="subtitle1" fontWeight={800} sx={{ mb: .5 }}>{t.title}</Typography>
                {t.body && <Typography variant="body2" color="text.secondary">{t.body}</Typography>}
                <FeedMentionPreview body={t.body} />
                <Typography variant="caption" color="text.secondary" sx={{ display:'block', mt: 1 }}>{t.commentsCount || 0} comments</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
      {hasNext && (
        <Box sx={{ display:'flex', justifyContent:'center', mt: 2 }}>
          <Button variant="outlined" onClick={() => load(page+1, false)} disabled={loading}>Load more</Button>
        </Box>
      )}
      {!loading && !items.length && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>No posts yet. Follow users to see their threads.</Typography>
      )}
    </Box>
  );
}
