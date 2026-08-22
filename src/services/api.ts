import axios from 'axios';
import { authStorage } from './authStorage';

// Base URL for Laravel API
const API_BASE_URL = 'https://basma-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // Required for Sanctum SPA authentication
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = authStorage.get()?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      authStorage.clear();
    }
    return Promise.reject(error);
  }
);

export default api;
