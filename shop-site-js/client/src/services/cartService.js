import api from './apiClient.js';

export const fetchCart = (signal) => api.get('/cart', { signal });

export const addToCart = (productId, quantity = 1) =>
  api.post('/cart', { productId, quantity });

export const updateCartItem = (productId, quantity) =>
  api.put(`/cart/${productId}`, { quantity });

export const removeCartItem = (productId) => api.delete(`/cart/${productId}`);

export const clearCart = () => api.delete('/cart');

/** Folds a guest's localStorage cart into their server cart right after login. */
export const mergeCart = (items) => api.post('/cart/merge', { items });
