import { api } from './api.js';

export const users = {
  getProfile: (id) => api.get(`/users/${id}`),
  follow: (id) => api.post(`/users/${id}/follow`),
  unfollow: (id) => api.post(`/users/${id}/unfollow`),
  followers: (id) => api.get(`/users/${id}/followers`),
  following: (id) => api.get(`/users/${id}/following`),
};
