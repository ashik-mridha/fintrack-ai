import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !err.config?.url?.includes('/auth/login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('fintrack:logout'));
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        window.location.assign('/login');
      }
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

export const transactionApi = {
  list: (params) => api.get('/transactions', { params }),
  create: (data) => api.post('/transactions', data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  remove: (id) => api.delete(`/transactions/${id}`),
  summary: () => api.get('/transactions/summary'),
  monthly: (params) => api.get('/transactions/monthly', { params }),
};

export const aiApi = {
  summary: () => api.get('/ai/summary'),
  categorize: (text) => api.post('/ai/categorize', { text }),
};

export const budgetApi = {
  list: (params) => api.get('/budgets', { params }),
  upsert: (data) => api.put('/budgets', data),
  remove: (id) => api.delete(`/budgets/${id}`),
};

export default api;
