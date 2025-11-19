import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardActionArea, CardContent, Typography, Chip, Box } from '@mui/material';

function AnimeCard({ anime }) {
  const imgLargeWebp = anime.images?.webp?.large_image_url || anime.images?.webp?.image_url;
  const imgLargeJpg = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
  const img = imgLargeWebp || imgLargeJpg || anime.image_url;
  const title = anime.title || anime.title_english || anime.title_japanese;
  const score = anime.score ?? anime.scored;

  return (
    <Card sx={{ ':hover': { transform: 'translateY(-4px)', boxShadow: 6 }, transition: 'all .2s ease' }}>
      <CardActionArea component={Link} to={`/anime/${anime.mal_id}`}>
        {img && (
          <Box sx={{ position: 'relative', width: '100%', aspectRatio: '3/4', overflow: 'hidden', bgcolor: 'background.default' }}>
            <picture>
              {imgLargeWebp && (
                <source
                  type="image/webp"
                  srcSet={`${anime.images?.webp?.image_url} 1x, ${imgLargeWebp} 2x`}
                />
              )}
              <img
                src={imgLargeJpg || img}
                srcSet={`${anime.images?.jpg?.image_url || img} 1x, ${(imgLargeJpg || img)} 2x`}
                sizes="(max-width:600px) 50vw, (max-width:900px) 33vw, (max-width:1200px) 25vw, 20vw"
                alt={title}
                loading="lazy"
                decoding="async"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </picture>
          </Box>
        )}
        <CardContent>
          <Typography variant="subtitle2" fontWeight={700} sx={{ minHeight: 36, overflow: 'hidden' }}>
            {title}
          </Typography>
          {score ? (
            <Box sx={{ mt: 0.5 }}>
              <Chip size="small" label={`⭐ ${score}`} variant="outlined" />
            </Box>
          ) : null}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default React.memo(AnimeCard, (prev, next) => prev.anime?.mal_id === next.anime?.mal_id);
