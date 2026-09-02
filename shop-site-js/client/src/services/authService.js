import api from './apiClient.js';

export const register = (payload) => api.post('/auth/register', payload, { auth: false });

export const login = (payload) => api.post('/auth/login', payload, { auth: false });

export const fetchCurrentUser = (signal) => api.get('/auth/me', { signal });

export const fetchProfile = (signal) => api.get('/users/me', { signal });

export const updateProfile = (payload) => api.put('/users/me', payload);
