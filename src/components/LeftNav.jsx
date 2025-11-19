import React from 'react';
import { Stack, Button } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const LinkBtn = ({ to, label }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Button
      component={RouterLink}
      to={to}
      variant={active ? 'contained' : 'text'}
      color={active ? 'primary' : 'inherit'}
      sx={{ justifyContent: 'flex-start' }}
    >
      {label}
    </Button>
  );
};

export default function LeftNav() {
  const { user } = useAuth();
  return (
    <Stack spacing={1.2} sx={{ position: 'sticky', top: 72 }}>
      <LinkBtn to="/" label="Home" />
      <LinkBtn to="/simulcasts" label="Simulcasts" />
      <LinkBtn to="/genres" label="Genres" />
      <LinkBtn to="/top" label="Highest Rated" />
      <LinkBtn to="/search" label="Search" />
      <LinkBtn to="/me/lists" label="My Lists" />
      <LinkBtn to="/me/recommendations" label="Recommendations" />
      {user && <LinkBtn to={`/users/${user.id}`} label="My Profile" />}
    </Stack>
  );
}
