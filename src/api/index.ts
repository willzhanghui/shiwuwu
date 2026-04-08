import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const getProjects = () => api.get('/projects');
export const getAccounts = () => api.get('/accounts');
export const getStats = () => api.get('/stats');

export default api;
