import api from './apiClient.js';

export const checkout = () => api.post('/orders');

export const fetchOrders = (signal) => api.get('/orders', { signal });

export const fetchOrder = (id, signal) => api.get(`/orders/${id}`, { signal });
