import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  },
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
};

// Posts API
export const postsAPI = {
  getAll: async (page: number = 1, limit: number = 10, sortBy: string = 'createdAt') => {
    const response = await api.get(`/posts?page=${page}&limit=${limit}&sortBy=${sortBy}`);
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },
  create: async (title: string, content: string) => {
    const response = await api.post('/posts', { title, content });
    return response.data;
  },
  update: async (id: number, title: string, content: string) => {
    const response = await api.patch(`/posts/${id}`, { title, content });
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },
  like: async (id: number) => {
    const response = await api.post(`/posts/${id}/like`);
    return response.data;
  },
};

// Comments API
export const commentsAPI = {
  getByPost: async (postId: number) => {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  },
  create: async (postId: number, content: string) => {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response.data;
  },
  update: async (postId: number, commentId: number, content: string) => {
    const response = await api.patch(`/posts/${postId}/comments/${commentId}`, { content });
    return response.data;
  },
  delete: async (postId: number, commentId: number) => {
    const response = await api.delete(`/posts/${postId}/comments/${commentId}`);
    return response.data;
  },
};

export default api;
