import React, { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import AnimeCard from './AnimeCard.jsx';
import { useToast } from './Toast.jsx';
import { Typography, Box, Skeleton, Pagination } from '@mui/material';

const cacheStore = (typeof window !== 'undefined') ? (window.__ANILIST_CACHE__ ||= new Map()) : new Map();

export default function AnimeList({ title, fetchPage, cacheKey }) {
  const { show } = useToast();
  const fetchingRef = useRef(false);

  const initialState = { items: [], page: 1, loading: false, error: null, totalPages: 1 };
  function reducer(state, action) {
    switch (action.type) {
      case 'INIT_LOAD':
        return { ...state, loading: true, error: null };
      case 'LOAD_SUCCESS': {
        const { items, page, totalPages } = action.payload;
        return { ...state, items, page, totalPages, loading: false };
      }
      case 'LOAD_ERROR':
        return { ...state, loading: false, error: action.payload };
      case 'RESTORE':
        return { ...state, ...action.payload };
      default:
        return state;
    }
  }
  const [state, dispatch] = useReducer(reducer, initialState);
  const { items, page, loading, error, totalPages } = state;

  const loadPage = useCallback(async (p) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    dispatch({ type: 'INIT_LOAD' });
    try {
      const { data, pagination } = await fetchPage(p, 12);
      const last = pagination?.last_visible_page || (pagination?.has_next_page ? p + 1 : p);
      dispatch({ type: 'LOAD_SUCCESS', payload: { items: data || [], page: p, totalPages: last || 1 } });
    } catch (e) {
      const msg = e?.message || 'Failed to load';
      dispatch({ type: 'LOAD_ERROR', payload: msg });
      show(`${title}: ${msg}`, 'error');
    } finally {
      fetchingRef.current = false;
    }
  }, [fetchPage, show, title]);

  const keyRef = useRef(null);
  useEffect(() => {
    const key = cacheKey || title;
    keyRef.current = key;
    const cached = cacheStore.get(key);
    if (cached && Array.isArray(cached.items) && cached.items.length > 0) {
      dispatch({ type: 'RESTORE', payload: { items: cached.items, page: cached.page || 1, totalPages: cached.totalPages || 1, loading: false, error: null } });
    } else {
      dispatch({ type: 'RESTORE', payload: { items: [], page: 1, totalPages: 1, loading: true, error: null } });
      loadPage(1);
    }
  }, [cacheKey, title]);
  useEffect(() => {
    const key = keyRef.current;
    if (!key) return;
    cacheStore.set(key, { items, page, totalPages });
  }, [items, page, totalPages]);

  const skeletons = useMemo(() => new Array(12).fill(0), []);

  return (
    <section className="container" style={{ margin: '24px 0' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography variant="h6" fontWeight={800}>{title}</Typography>
      </Box>
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)'
          },
          alignItems: 'stretch'
        }}
      >
        {items.map((anime) => (
          <Box key={`${anime.mal_id}-${title}`} sx={{ height: '100%' }}>
            <AnimeCard anime={anime} />
          </Box>
        ))}
        {loading && items.length === 0 && skeletons.map((_, i) => (
          <Box key={`s-${i}`}>
            <Skeleton variant="rounded" sx={{ mb: 1, width:'100%', aspectRatio:'3/4' }} />
            <Skeleton variant="text" width="80%" />
          </Box>
        ))}
      </Box>
      {!loading && items.length === 0 && !error && (
        <Box sx={{ py: 3, textAlign: 'center', color: 'text.secondary' }}>No results found.</Box>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => { loadPage(value); }}
          color="primary"
          shape="rounded"
        />
      </Box>
    </section>
  );
}
