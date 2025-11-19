import { api } from './api.js';

export const reviews = {
  upsert: ({ malId, rating, text }) => api.post('/reviews', { malId, rating, text }),
  forAnime: (malId) => api.get(`/reviews/anime/${malId}`),
};
