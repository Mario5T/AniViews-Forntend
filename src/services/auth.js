import { api } from './api.js';

export const auth = {
  register: ({ username, email, password }) => api.post('/auth/register', { username, email, password }),
  login: ({ email, password }) => api.post('/auth/login', { email, password }),
};
