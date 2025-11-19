import React from 'react';
import { Box, Container, Divider, Link, Stack, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box component="footer" sx={{ mt: 6, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
          <Box>
            <Typography variant="h6" fontWeight={800}>AniViews+</Typography>
            <Typography variant="body2" color="text.secondary">Discover, track, and share anime you love.</Typography>
          </Box>
          <Stack direction="row" spacing={3}>
            <Link href="/genres" color="inherit" underline="hover">Genres</Link>
            <Link href="/top" color="inherit" underline="hover">Highest Rated</Link>
            <Link href="/search" color="inherit" underline="hover">Search</Link>
          </Stack>
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} AniViews+. All rights reserved.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Anime data provided by <Link href="https://jikan.moe" target="_blank" rel="noopener" underline="hover">Jikan API</Link>
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
