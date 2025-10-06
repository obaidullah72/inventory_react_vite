const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function getAuthToken() {
  return localStorage.getItem('token');
}

export async function apiRequest(path, { method = 'GET', body, headers } = {}) {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data?.error || 'Request failed');
    error.status = res.status;
    throw error;
  }
  return data;
}

export const AuthAPI = {
  login: (email, password) => apiRequest('/auth/login', { method: 'POST', body: { email, password } }),
  register: (name, email, password) => apiRequest('/auth/register', { method: 'POST', body: { name, email, password } }),
  me: () => apiRequest('/auth/me'),
};

export const CategoriesAPI = {
  list: () => apiRequest('/categories'),
  create: (payload) => apiRequest('/categories', { method: 'POST', body: payload }),
  update: (id, payload) => apiRequest(`/categories/${id}`, { method: 'PUT', body: payload }),
  remove: (id) => apiRequest(`/categories/${id}`, { method: 'DELETE' }),
};

export const ProductsAPI = {
  list: (q) => apiRequest(`/products${q ? `?q=${encodeURIComponent(q)}` : ''}`),
  create: (payload) => apiRequest('/products', { method: 'POST', body: payload }),
  update: (id, payload) => apiRequest(`/products/${id}`, { method: 'PUT', body: payload }),
  remove: (id) => apiRequest(`/products/${id}`, { method: 'DELETE' }),
};

export const SettingsAPI = {
  list: () => apiRequest('/settings'),
  upsert: (key, value) => apiRequest('/settings', { method: 'POST', body: { key, value } }),
  remove: (key) => apiRequest(`/settings/${encodeURIComponent(key)}`, { method: 'DELETE' }),
};

export const VendorsAPI = {
  list: () => apiRequest('/vendors'),
  create: (payload) => apiRequest('/vendors', { method: 'POST', body: payload }),
  update: (id, payload) => apiRequest(`/vendors/${id}`, { method: 'PUT', body: payload }),
  remove: (id) => apiRequest(`/vendors/${id}`, { method: 'DELETE' }),
  get: (id) => apiRequest(`/vendors/${id}`),
};

export const CustomersAPI = {
  list: () => apiRequest('/customers'),
  create: (payload) => apiRequest('/customers', { method: 'POST', body: payload }),
  update: (id, payload) => apiRequest(`/customers/${id}`, { method: 'PUT', body: payload }),
  remove: (id) => apiRequest(`/customers/${id}`, { method: 'DELETE' }),
  get: (id) => apiRequest(`/customers/${id}`),
};


