// src/api/axiosConfig.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // your NestJS API base URL
});

// 🔹 Automatically attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
