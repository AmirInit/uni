import api from './apiClient.js';
import { toEnglishDigits } from '../lib/format.js';

/** GET /api/products with search / category / sort / pagination. */
export const fetchProducts = ({ search, category, sort, page, limit } = {}, signal) => {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (category) params.set('category', category);
  if (sort) params.set('sort', sort);
  if (page) params.set('page', String(page));
  if (limit) params.set('limit', String(limit));

  const query = params.toString();
  return api.get(`/products${query ? `?${query}` : ''}`, { auth: false, signal });
};

export const fetchProduct = (id, signal) =>
  api.get(`/products/${id}`, { auth: false, signal });

export const fetchCategories = (signal) =>
  api.get('/products/categories', { auth: false, signal });

/** Numeric fields are normalised to ASCII digits so Persian input is accepted. */
const serialiseProduct = (values) => ({
  name: values.name?.trim(),
  description: values.description?.trim() ?? '',
  price: toEnglishDigits(values.price).replace(/[,٬\s]/g, ''),
  stock: toEnglishDigits(values.stock).replace(/[,٬\s]/g, ''),
  imageUrl: values.imageUrl?.trim() ?? '',
  category: values.category?.trim() ?? '',
});

export const createProduct = (values) => api.post('/products', serialiseProduct(values));

export const updateProduct = (id, values) => api.put(`/products/${id}`, serialiseProduct(values));

export const deleteProduct = (id) => api.delete(`/products/${id}`);
