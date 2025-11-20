import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { AppBar, Toolbar, Typography, Box, TextField, Button, Stack, Link } from '@mui/material';
import Logo from './Logo.jsx';

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
      <Toolbar sx={{ gap: 2, position: 'relative' }}>
        <Box component={RouterLink} to="/" sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', textDecoration: 'none', color: 'inherit' }}>
          <Logo width={220} />
        </Box>
        <Box component="form" onSubmit={onSubmit} sx={{ ml: 'auto' }}>
          <TextField size="small" placeholder="Search anime..." value={q} onChange={(e)=>setQ(e.target.value)} sx={{ minWidth: 260 }} />
        </Box>
        {!user ? (
          <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
            <Button component={RouterLink} to="/login" variant="text">Login</Button>
            <Button component={RouterLink} to="/register" variant="contained">Register</Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={1} alignItems="center" sx={{ position: 'absolute', left: 16 }}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '.2px' }}>
              Hi, {user.username || user.email}
            </Typography>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
}

