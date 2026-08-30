import axios from 'axios';

// Root Laravel app URL (no /api suffix) — needed for the CSRF cookie
// endpoint, which lives outside the /api prefix.
const API_ROOT = 'http://localhost:8000';
const API_BASE_URL = `${API_ROOT}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
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
const ensureCsrfCookie = async (): Promise<void> => {
  if (document.cookie.includes('XSRF-TOKEN')) return;
  await axios.get(`${API_ROOT}/sanctum/csrf-cookie`, { withCredentials: true });
};

api.interceptors.request.use(async (config) => {
  const method = (config.method || 'get').toLowerCase();
  if (method !== 'get') {
    await ensureCsrfCookie();
  }
  return config;
});

// No response-side cleanup needed anymore on 401 — there's no client-side
// token/user snapshot to clear. AuthContext re-checks /auth/user and reacts
// to the 401 itself.
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;
