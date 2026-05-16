import axios from 'axios';

const API = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || '/api' 
});

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  if (user && user.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);
export const fetchAnnouncements = () => API.get('/announcements');
export const createAnnouncement = (data) => API.post('/announcements', data);
export const fetchResources = (params) => API.get('/resources', { params });
export const uploadResource = (data) => API.post('/resources', data);

export default API;
