import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { users } from '../services/users.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import { Box, Avatar, Typography, Stack, Card, CardContent } from '@mui/material';

export default function Profile() {
  const { id } = useParams();
  const { user } = useAuth();
  const { show } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const isMe = user && (user.id === id);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    users.getProfile(id).then((p)=>{ if(mounted){ setProfile(p); setLoading(false);} })
      .catch((e)=>{ if(mounted){ show(e.message||'Error', 'error'); setLoading(false);} });
    return ()=>{ mounted=false };
  }, [id, show]);

  if (loading) return <div className="container">Loading...</div>;
  if (!profile) return <div className="container">Not found</div>;

  const canFollow = user && !isMe;
  const amFollowing = !!(profile.followers || []).find(f => String(f) === String(user?.id));

  const onFollowToggle = async () => {
    try {
      if (amFollowing) {
        await users.unfollow(id);
        show('Unfollowed', 'success');
      } else {
        await users.follow(id);
        show('Followed', 'success');
      }
      const p = await users.getProfile(id);
      setProfile(p);
    } catch (e) { show(e.message||'Error', 'error'); }
  };

  return (
    <div className="container" style={{ maxWidth: 900 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>{(profile.username||profile.email||'U').slice(0,1).toUpperCase()}</Avatar>
        <Box>
          <Typography variant="h5" fontWeight={800}>{profile.username}</Typography>
          <Typography variant="body2" color="text.secondary">{profile.email}</Typography>
        </Box>
        <Box sx={{ ml: 'auto' }}>
          <Typography variant="body2" sx={{ mr: 2 }}>Followers: {profile.followers?.length || 0} • Following: {profile.following?.length || 0}</Typography>
          {canFollow && (
            <button className="button" onClick={onFollowToggle}>{amFollowing ? 'Unfollow' : 'Follow'}</button>
          )}
        </Box>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>Followers</Typography>
            <FollowerList userId={profile._id} type="followers" />
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>Following</Typography>
            <FollowerList userId={profile._id} type="following" />
          </CardContent>
        </Card>
      </Stack>
    </div>
  );
}

function FollowerList({ userId, type }) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}/${type}`);
        const json = await res.json();
        if (!mounted) return;
        setItems(json[type] || []);
      } catch {}
    };
    if (userId) load();
    return () => { mounted = false; };
  }, [userId, type]);

  if (!items.length) return <Typography variant="body2" color="text.secondary">No {type}.</Typography>;
  return (
    <Stack spacing={1}>
      {items.map((u) => (
        <Stack key={u._id} direction="row" spacing={1} alignItems="center">
          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>{(u.username||u.email||'U').slice(0,1).toUpperCase()}</Avatar>
          <Typography component="a" href={`/users/${u._id}`} sx={{ textDecoration:'none', color:'inherit' }}>{u.username || u.email}</Typography>
        </Stack>
      ))}
    </Stack>
  );
}
