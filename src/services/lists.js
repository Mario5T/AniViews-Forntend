import { api } from './api.js';

export const lists = {
  create: ({ name, description }) => api.post('/lists', { name, description }),
  mine: () => api.get('/lists/me'),
  addItem: (listId, { malId, title, score, status }) => api.post(`/lists/${listId}/items`, { malId, title, score, status }),
  removeItem: (listId, malId) => api.del(`/lists/${listId}/items/${malId}`),
  update: (listId, { name, description }) => api.patch(`/lists/${listId}`, { name, description }),
  delete: (listId) => api.del(`/lists/${listId}`),
};
