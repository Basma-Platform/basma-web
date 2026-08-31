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
  withCredentials: true, // send/receive the session + XSRF cookies
  withXSRFToken: true,   // axios: read XSRF-TOKEN cookie, send as X-XSRF-TOKEN header
});

/**
 * FIX (security): no more Bearer token stored in localStorage/sessionStorage
 * for an attacker's script to read. Authentication now rides entirely on an
 * httpOnly session cookie the browser sends automatically — there is
 * nothing here for JavaScript to attach manually.
 *
 * The only thing we still need to manage ourselves is Sanctum's CSRF
 * protection: before any state-changing request (POST/PUT/PATCH/DELETE),
 * the browser needs an XSRF-TOKEN cookie to exist so axios can echo it back
 * as the X-XSRF-TOKEN header. This fetches that cookie lazily, exactly once
 * per browser session — GET requests don't need it at all.
 */
let csrfPromise: Promise<void> | null = null;

const ensureCsrfCookie = async (): Promise<void> => {
  // Check if XSRF-TOKEN cookie already exists
  if (document.cookie.includes('XSRF-TOKEN')) return;
  
  // If already fetching, wait for the existing promise
  if (csrfPromise) return csrfPromise;
  
  csrfPromise = (async () => {
    try {
      // ✅ استخدام api بدلاً من axios العادي
      await api.get('/sanctum/csrf-cookie');
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

// ✅ Response interceptor - handle 401 Unauthorized
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
