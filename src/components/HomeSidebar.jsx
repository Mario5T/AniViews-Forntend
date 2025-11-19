import React from 'react';
import { Card, CardContent, Stack, Button, Avatar, Typography, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function HomeSidebar() {
  const { user } = useAuth();
  return (
    <Stack spacing={2} sx={{ position: 'sticky', top: 72 }}>
      <Card>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: 'primary.main' }}>{(user?.username || user?.email || 'U').slice(0,1).toUpperCase()}</Avatar>
            <div>
              <Typography variant="subtitle1" fontWeight={800}>{user?.username || 'Guest'}</Typography>
              <Typography variant="caption" color="text.secondary">{user?.email || 'Not signed in'}</Typography>
            </div>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            {user ? (
              <Button component={RouterLink} to={`/users/${user.id}`} size="small" variant="contained">Profile</Button>
            ) : (
              <Button component={RouterLink} to="/login" size="small" variant="contained">Login</Button>
            )}
            {user && (
              <Button component={RouterLink} to="/me/lists" size="small" variant="outlined">My Lists</Button>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1 }}>Quick Access</Typography>
          <Stack spacing={1}>
            <Button component={RouterLink} to="/search" variant="text">Search</Button>
            <Button component={RouterLink} to="/genres" variant="text">Genres</Button>
            <Button component={RouterLink} to="/top" variant="text">Highest Rated</Button>
            {user && <Button component={RouterLink} to="/me/recommendations" variant="text">Recommendations</Button>}
          </Stack>
          <Divider sx={{ my: 1.5 }} />
          <Typography variant="caption" color="text.secondary">Chats and notifications coming soon.</Typography>
        </CardContent>
      </Card>
    </Stack>
  );
}
