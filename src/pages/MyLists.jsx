import React, { useEffect, useState } from 'react';
import { lists } from '../services/lists.js';
import { useToast } from '../components/Toast.jsx';
import { jikan } from '../services/jikan.js';
import { Card, CardContent, Typography, Stack, Box, Skeleton, TextField, Button } from '@mui/material';

export default function MyLists() {
  const { show } = useToast();
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await lists.mine();
      setData(res);
    } catch (e) { show(e.message || 'Error', 'error'); }
    finally { setLoading(false); }
  };

  const onCreate = async (e) => {
    e.preventDefault();
    try {
      await lists.create({ name, description });
      setName(''); setDescription('');
      show('List created', 'success');
      await load();
    } catch (e) { show(e.message || 'Error', 'error'); }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="container" style={{ maxWidth: 900 }}>
      <h2>My Lists</h2>
      <Box component="form" onSubmit={onCreate} sx={{ display: 'grid', gap: 1, my: 1.5 }}>
        <TextField
          required
          placeholder="List name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          fullWidth
          size="medium"
        />
        <TextField
          placeholder="Description"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
          fullWidth
          size="medium"
        />
        <Button type="submit" variant="contained" size="large" sx={{ borderRadius: 2 }}>Create</Button>
      </Box>
      {loading ? 'Loading...' : (
        <Stack spacing={1.5}>
          {data.map(l => (
            <Card key={l._id}>
              <CardContent>
                <ListHeader list={l} onChanged={load} onDeleted={load} />
                <Typography variant="caption" color="text.secondary" sx={{ display:'block', mt: .5 }}>
                  Items: {l.items?.length || 0}
                </Typography>
                <ListThumbs items={l.items || []} />
                <ItemGallery listId={l._id} items={l.items || []} onChanged={load} />
                <AddAnime listId={l._id} onAdded={load} />
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </div>
  );
}

function ListHeader({ list, onChanged, onDeleted }) {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(list.name);
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    setSaving(true);
    try { await lists.update(list._id, { name: newName }); await onChanged(); setEditing(false); }
    finally { setSaving(false); }
  };

  const onDelete = async () => {
    if (!confirm('Delete this list?')) return;
    await lists.delete(list._id);
    await onDeleted();
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
      {!editing ? (
        <Typography variant="subtitle1" fontWeight={800}>{list.name}</Typography>
      ) : (
        <TextField size="small" value={newName} onChange={(e)=>setNewName(e.target.value)} />
      )}
      <Stack direction="row" spacing={1}>
        {!editing ? (
          <>
            <Button size="small" variant="text" onClick={()=>setEditing(true)}>Edit</Button>
            <Button size="small" color="error" variant="text" onClick={onDelete}>Delete</Button>
          </>
        ) : (
          <>
            <Button size="small" variant="contained" disabled={saving} onClick={onSave}>Save</Button>
            <Button size="small" variant="text" onClick={()=>{ setEditing(false); setNewName(list.name); }}>Cancel</Button>
          </>
        )}
      </Stack>
    </Stack>
  );
}

function AddAnime({ listId, onAdded }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    if (!q.trim()) { setResults([]); return; }
    const run = async () => {
      setLoading(true);
      try {
        const { data } = await jikan.searchAnime(q.trim(), 1, 6);
        if (active) setResults(data || []);
      } finally { if (active) setLoading(false); }
    };
    const t = setTimeout(run, 300);
    return ()=>{ active=false; clearTimeout(t); };
  }, [q]);

  const add = async (anime) => {
    await lists.addItem(listId, { malId: anime.mal_id, title: anime.title });
    setQ(''); setResults([]);
    onAdded && onAdded();
  };

  return (
    <Box sx={{ mt: 1.5 }}>
      <TextField placeholder="Add anime to this list..." value={q} onChange={(e)=>setQ(e.target.value)} fullWidth size="small" />
      <Box sx={{ mt: 1, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
        {loading ? new Array(4).fill(0).map((_,i)=>(<Skeleton key={i} variant="rounded" height={72} />)) : (
          results.map(a => (
            <Stack key={a.mal_id} direction="row" spacing={1} alignItems="center" sx={{ p: 1, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor:'divider' }}>
              <img src={a.images?.jpg?.image_url || a.images?.webp?.image_url} alt={a.title} width={40} height={60} style={{ objectFit:'cover', borderRadius:4 }} />
              <Typography variant="body2" sx={{ flex: 1 }}>{a.title}</Typography>
              <Button size="small" variant="outlined" onClick={()=>add(a)}>Add</Button>
            </Stack>
          ))
        )}
      </Box>
    </Box>
  );
}

function ItemGallery({ listId, items, onChanged }) {
  if (!items.length) return null;
  return (
    <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {items.map(it => (
        <ItemThumb key={it.malId} listId={listId} item={it} onChanged={onChanged} />
      ))}
    </Box>
  );
}

function ItemThumb({ listId, item, onChanged }) {
  const [img, setImg] = useState(null);
  useEffect(() => {
    let active = true;
    const run = async () => {
      try {
        const d = await jikan.getAnimeDetails(item.malId);
        if (active) setImg(d.images?.jpg?.image_url || d.images?.webp?.image_url || null);
      } catch { if (active) setImg(null); }
    };
    run();
    return ()=>{ active=false; };
  }, [item.malId]);

  const remove = async () => { await lists.removeItem(listId, item.malId); onChanged && onChanged(); };

  return (
    <Stack spacing={0.5} alignItems="center" sx={{ width: 70 }}>
      {img ? (
        <img src={img} alt={item.title} width={56} height={84} style={{ objectFit:'cover', borderRadius:6 }} />
      ) : (
        <Skeleton variant="rounded" width={56} height={84} />
      )}
      <Button size="small" variant="text" color="error" onClick={remove}>Remove</Button>
    </Stack>
  );
}

function ListThumbs({ items }) {
  const [thumbs, setThumbs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    const run = async () => {
      setLoading(true);
      try {
        const top = (items || []).slice(0, 5);
        const details = await Promise.all(top.map(async (it) => {
          try {
            const data = await jikan.getAnimeDetails(it.malId);
            return { malId: it.malId, title: data.title, img: data.images?.jpg?.image_url || data.images?.webp?.image_url };
          } catch { return { malId: it.malId, title: it.title, img: null }; }
        }));
        if (!mounted) return;
        setThumbs(details);
      } finally { if (mounted) setLoading(false); }
    };
    run();
    return () => { mounted = false; };
  }, [items]);

  return (
    <Box sx={{ mt: 1.5, display: 'flex', gap: 1 }}>
      {loading ? new Array(5).fill(0).map((_,i)=>(<Skeleton key={i} variant="rounded" width={56} height={84} />)) : (
        thumbs.map(t => (
          t.img ? <img key={t.malId} src={t.img} alt={t.title} width={56} height={84} style={{ objectFit:'cover', borderRadius:6 }} />
                : <Box key={t.malId} sx={{ width:56, height:84, bgcolor:'action.hover', borderRadius:1 }} />
        ))
      )}
    </Box>
  );
}