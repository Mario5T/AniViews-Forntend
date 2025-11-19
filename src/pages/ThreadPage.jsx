import React, { useEffect, useState, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { threads } from '../services/threads.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Box, Button, Card, CardContent, Stack, TextField, Typography, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Avatar, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import ThumbUpIcon from '@mui/icons-material/ThumbUpAltOutlined';

export default function ThreadPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const initial = {
    data: null,
    loading: true,
    body: '',
    posting: false,
    page: 1,
    limit: 20,
    hasNext: false,
    comments: [],
    confirmThreadDel: false,
    confirmCommentDel: null,
    editThreadMode: false,
    editTitle: '',
    editBody: '',
    editingCommentId: null,
    editingCommentBody: '',
  };
  function reducer(state, action) {
    switch (action.type) {
      case 'SET_STATE':
        return { ...state, ...action.payload };
      case 'RESET_FOR_THREAD':
        return { ...initial, loading: true };
      default:
        return state;
    }
  }
  const [s, dispatch] = useReducer(reducer, initial);

  const load = async (opts = { reset: false }) => {
    dispatch({ type: 'SET_STATE', payload: { loading: true } });
    try {
      const res = await threads.get(id, { page: s.page, limit: s.limit });
      const nextComments = opts.reset ? (res.comments || []) : [...s.comments, ...(res.comments || [])];
      dispatch({ type: 'SET_STATE', payload: { data: res, comments: nextComments, hasNext: Boolean(res?.pagination?.has_next_page), loading: false } });
    } catch (e) {
      dispatch({ type: 'SET_STATE', payload: { loading: false } });
    }
  };

  const onPost = async (e) => {
    e.preventDefault();
    if (!s.body.trim()) return;
    dispatch({ type: 'SET_STATE', payload: { posting: true } });
    try {
      await threads.addComment(id, s.body.trim());
      dispatch({ type: 'SET_STATE', payload: { body: '' } });
      await load();
    } catch (e) {
    } finally { dispatch({ type: 'SET_STATE', payload: { posting: false } }); }
  };

  useEffect(() => {
    dispatch({ type: 'RESET_FOR_THREAD' });
    dispatch({ type: 'SET_STATE', payload: { page: 1 } });
    load({ reset: true });
  }, [id]);

  useEffect(() => {
    if (s.page > 1) load({ reset: false });
  }, [s.page]);

  if (s.loading) return <div className="container">Loading...</div>;
  if (!s.data) return <div className="container">Not found</div>;

  const { thread } = s.data;
  const isOwner = user && s.data?.thread?.user && String(s.data.thread.user) === String(user.id);

  return (
    <div className="container" style={{ maxWidth: 800 }}>
      {!s.editThreadMode ? (
        <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', mb: 1 }}>
          <Typography variant="h5" fontWeight={800}>{thread.title}</Typography>
          {isOwner && (
            <Stack direction="row" spacing={1}>
              <Tooltip title="Edit thread">
                <IconButton size="small" onClick={()=>{ dispatch({ type:'SET_STATE', payload: { editThreadMode: true, editTitle: thread.title, editBody: thread.body || '' } }); }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete thread">
                <IconButton color="error" size="small" onClick={()=>dispatch({ type:'SET_STATE', payload:{ confirmThreadDel: true } })}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          )}
        </Box>
      ) : (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Stack spacing={1}>
              <TextField label="Title" value={s.editTitle} onChange={(e)=>dispatch({ type:'SET_STATE', payload:{ editTitle: e.target.value } })} />
              <TextField label="Body" multiline minRows={3} value={s.editBody} onChange={(e)=>dispatch({ type:'SET_STATE', payload:{ editBody: e.target.value } })} />
              <Stack direction="row" spacing={1}>
                <Button variant="contained" onClick={async ()=>{ await threads.editThread(thread._id, { title: s.editTitle, body: s.editBody }); dispatch({ type:'SET_STATE', payload:{ editThreadMode:false, page:1, comments:[] } }); await load({ reset: true }); }}>Save</Button>
                <Button variant="text" onClick={()=>dispatch({ type:'SET_STATE', payload:{ editThreadMode:false } })}>Cancel</Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}
      <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>{new Date(thread.createdAt).toLocaleString()}</Typography>
      {/* Thread author */}
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
        <Avatar component={RouterLink} to={`/users/${thread.user?._id || thread.user}`} sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
          {(thread.user?.username || thread.user?.email || 'U').slice(0,1).toUpperCase()}
        </Avatar>
        <MuiLink component={RouterLink} to={`/users/${thread.user?._id || thread.user}`} underline="hover" color="inherit" sx={{ fontWeight: 800 }}>
          {thread.user?.username || thread.user?.email || 'User'}
        </MuiLink>
      </Stack>
      {thread.body && <Card sx={{ mb: 2 }}><CardContent><Typography whiteSpace="pre-wrap">{thread.body}</Typography></CardContent></Card>}

      <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 2, mb: 1 }}>Comments</Typography>
      {user && (
        <Box component="form" onSubmit={onPost} sx={{ mb: 2 }}>
          <Stack spacing={1}>
            <TextField multiline minRows={2} label="Write a comment" value={s.body} onChange={(e)=>dispatch({ type:'SET_STATE', payload:{ body: e.target.value } })} />
            <Box>
              <Button type="submit" variant="contained" disabled={s.posting}>Post</Button>
            </Box>
          </Stack>
        </Box>
      )}

      <Stack spacing={1.5}>
        {s.comments.map((c) => {
          const canDelete = user && c.user && String(c.user) === String(user.id);
          const isEditing = s.editingCommentId === c._id;
          return (
            <Card key={c._id}>
              <CardContent>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Avatar component={RouterLink} to={`/users/${c.user?._id || c.user}`} sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                    {(c.user?.username || c.user?.email || 'U').slice(0,1).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display:'flex', alignItems:'center', gap: 1 }}>
                      <MuiLink component={RouterLink} to={`/users/${c.user?._id || c.user}`} underline="hover" color="inherit" sx={{ fontWeight: 700 }}>
                        {c.user?.username || c.user?.email || 'User'}
                      </MuiLink>
                      <Typography variant="caption" color="text.secondary">{new Date(c.createdAt).toLocaleString()}</Typography>
                    </Box>
                    {!isEditing ? (
                      <Typography variant="body2" whiteSpace="pre-wrap" sx={{ mt: .5 }}>{c.body}</Typography>
                    ) : (
                      <Stack spacing={1} sx={{ mt: .5 }}>
                        <TextField multiline minRows={2} value={s.editingCommentBody} onChange={(e)=>dispatch({ type:'SET_STATE', payload:{ editingCommentBody: e.target.value } })} />
                        <Stack direction="row" spacing={1}>
                          <Button size="small" variant="contained" onClick={async ()=>{ await threads.editComment(thread._id, c._id, s.editingCommentBody); dispatch({ type:'SET_STATE', payload:{ editingCommentId:null, page:1, comments:[] } }); await load({ reset: true }); }}>Save</Button>
                          <Button size="small" onClick={()=>dispatch({ type:'SET_STATE', payload:{ editingCommentId:null } })}>Cancel</Button>
                        </Stack>
                      </Stack>
                    )}
                  </Box>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Tooltip title="Like">
                      <IconButton size="small" onClick={async ()=>{ await threads.likeComment(thread._id, c._id); dispatch({ type:'SET_STATE', payload:{ page:1, comments:[] } }); await load({ reset: true }); }}>
                        <ThumbUpIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                    <Typography variant="caption">{c.likes || 0}</Typography>
                    {canDelete && !isEditing && (
                      <>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={()=>{ dispatch({ type:'SET_STATE', payload:{ editingCommentId: c._id, editingCommentBody: c.body } }); }}>
                            <EditIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete comment">
                          <IconButton color="error" size="small" onClick={()=>dispatch({ type:'SET_STATE', payload:{ confirmCommentDel: c._id } })}>
                            <DeleteIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </Stack>
                </Stack>
                <Typography variant="caption" color="text.secondary">{new Date(c.createdAt).toLocaleString()}</Typography>
              </CardContent>
            </Card>
          );
        })}
        {!s.comments.length && (
          <Typography variant="body2" color="text.secondary">No comments yet.</Typography>
        )}
      </Stack>
      {s.hasNext && (
        <Box sx={{ display:'flex', justifyContent:'center', mt: 2 }}>
          <Button variant="outlined" onClick={()=> dispatch({ type:'SET_STATE', payload:{ page: s.page + 1 } })}>Load more comments</Button>
        </Box>
      )}

      {/* Confirm delete thread */}
      <Dialog open={s.confirmThreadDel} onClose={()=>dispatch({ type:'SET_STATE', payload:{ confirmThreadDel:false } })}>
        <DialogTitle>Delete thread?</DialogTitle>
        <DialogContent>
          <DialogContentText>This will permanently remove the thread and its comments.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>dispatch({ type:'SET_STATE', payload:{ confirmThreadDel:false } })}>Cancel</Button>
          <Button color="error" onClick={async ()=>{ await threads.deleteThread(thread._id); dispatch({ type:'SET_STATE', payload:{ confirmThreadDel:false } }); window.history.back(); }}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm delete comment */}
      <Dialog open={!!s.confirmCommentDel} onClose={()=>dispatch({ type:'SET_STATE', payload:{ confirmCommentDel:null } })}>
        <DialogTitle>Delete comment?</DialogTitle>
        <DialogActions>
          <Button onClick={()=>dispatch({ type:'SET_STATE', payload:{ confirmCommentDel:null } })}>Cancel</Button>
          <Button color="error" onClick={async ()=>{ if (s.confirmCommentDel) { await threads.deleteComment(thread._id, s.confirmCommentDel); dispatch({ type:'SET_STATE', payload:{ confirmCommentDel:null, page:1, comments:[] } }); await load({ reset: true }); } }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
