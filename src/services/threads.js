import { api } from './api.js';

export const threads = {
  listForAnime: (malId) => api.get(`/threads/anime/${malId}`),
  create: ({ malId, title, body }) => api.post('/threads', { malId, title, body }),
  get: (id, { page = 1, limit = 20 } = {}) => api.get(`/threads/${id}?page=${page}&limit=${limit}`),
  addComment: (id, body) => api.post(`/threads/${id}/comments`, { body }),
  deleteThread: (id) => api.del(`/threads/${id}`),
  deleteComment: (threadId, commentId) => api.del(`/threads/${threadId}/comments/${commentId}`),
  editThread: (id, { title, body }) => api.patch(`/threads/${id}`, { title, body }),
  editComment: (threadId, commentId, body) => api.patch(`/threads/${threadId}/comments/${commentId}`, { body }),
  likeComment: (threadId, commentId) => api.post(`/threads/${threadId}/comments/${commentId}/like`, {}),
  feed: ({ page = 1, limit = 10 } = {}) => api.get(`/threads/feed?page=${page}&limit=${limit}`),
};
