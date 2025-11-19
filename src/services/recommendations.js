import { api } from './api.js';

export const recommendations = {
  mine: () => api.get('/recommendations/me'),
};
