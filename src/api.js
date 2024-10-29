import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Points to your ASP.NET backend
});

// Automatically attach the JWT if it's stored in localStorage
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // Update as per token storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
