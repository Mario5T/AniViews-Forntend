import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { AppBar, Toolbar, Typography, Box, TextField, Button, Stack, Link } from '@mui/material';

export default function Navbar() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const onSubmit = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <AppBar position="sticky" color="transparent" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', backdropFilter: 'blur(6px)' }}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant="h6" fontWeight={800} component={RouterLink} to="/" sx={{ textDecoration: 'none', color: 'text.primary' }}>
          AniViews+
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Link component={RouterLink} to="/" underline="hover" color="inherit">Home</Link>
          <Link component={RouterLink} to="/simulcasts" underline="hover" color="inherit">Simulcasts</Link>
          <Link component={RouterLink} to="/genres" underline="hover" color="inherit">Genres</Link>
          <Link component={RouterLink} to="/top" underline="hover" color="inherit">Highest Rated</Link>
          {user && (
            <>
              <Link component={RouterLink} to="/me/lists" underline="hover" color="inherit">My Lists</Link>
              <Link component={RouterLink} to="/me/recommendations" underline="hover" color="inherit">Recommendations</Link>
            </>
          )}
        </Stack>
        <Box component="form" onSubmit={onSubmit} sx={{ ml: 'auto' }}>
          <TextField size="small" placeholder="Search anime..." value={q} onChange={(e)=>setQ(e.target.value)} sx={{ minWidth: 260 }} />
        </Box>
        {!user ? (
          <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
            <Button component={RouterLink} to="/login" variant="text">Login</Button>
            <Button component={RouterLink} to="/register" variant="contained">Register</Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 2 }}>
            <Typography variant="body2" sx={{ opacity: .8 }}>Hi, {user.username || user.email}</Typography>
            <Button variant="outlined" color="inherit" onClick={logout}>Logout</Button>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
}
