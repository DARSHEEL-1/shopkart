import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Match your backend port
  withCredentials: true,          // Required for HttpOnly cookies
});

// --- Product Discovery APIs ---

// Fetch all products with optional search and category filters
export const fetchProducts = async (search = '', category = '') => {
  const params = {};
  if (search) params.search = search;
  if (category && category !== 'All Categories') params.category = category;
  
  const response = await api.get('/products', { params });
  return response.data;
};

// Fetch a single product by its MongoDB _id
export const fetchProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export default api;