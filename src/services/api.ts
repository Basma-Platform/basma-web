import axios from 'axios';

// ✅ استخدام رابط الـ Backend على Render.com
const API_ROOT = 'https://basma-backend.onrender.com';
const API_BASE_URL = `${API_ROOT}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
  withXSRFToken: true,
});

let csrfPromise: Promise<void> | null = null;

const ensureCsrfCookie = async (): Promise<void> => {
  if (document.cookie.includes('XSRF-TOKEN')) return;
  if (csrfPromise) return csrfPromise;
  
  csrfPromise = (async () => {
    try {
      // ✅ استخدام axios العادي مع API_ROOT مباشرة
      await axios.get(`${API_ROOT}/sanctum/csrf-cookie`, {
        withCredentials: true,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
    } catch (error) {
      console.error('Failed to fetch CSRF cookie:', error);
    } finally {
      csrfPromise = null;
    }
  })();
  
  return csrfPromise;
};

api.interceptors.request.use(async (config) => {
  const method = (config.method || 'get').toLowerCase();
  if (method !== 'get') {
    await ensureCsrfCookie();
  }
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;
