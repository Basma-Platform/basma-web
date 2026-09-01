import axios from 'axios';

// Root Laravel app URL — changed to Render deployment
const API_ROOT = 'https://basma-backend.onrender.com';
const API_BASE_URL = `${API_ROOT}/api`;

console.log('🔧 [API] Initialized with base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // send/receive the session + XSRF cookies
  withXSRFToken: true,   // axios: read XSRF-TOKEN cookie, send as X-XSRF-TOKEN header
});

// ✅ Debug: Log all requests
api.interceptors.request.use(
  (config) => {
    console.log(`📤 [API] ${config.method?.toUpperCase()} ${config.url}`);
    console.log('📤 [API] Headers:', config.headers);
    console.log('📤 [API] Data:', config.data);
    return config;
  },
  (error) => {
    console.error('❌ [API] Request Error:', error);
    return Promise.reject(error);
  }
);

// ✅ Debug: Log all responses
api.interceptors.response.use(
  (response) => {
    console.log(`📥 [API] ${response.status} ${response.config.url}`);
    console.log('📥 [API] Response:', response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`❌ [API] Response Error ${error.response.status}: ${error.response.config.url}`);
      console.error('❌ [API] Error Data:', error.response.data);
      console.error('❌ [API] Error Headers:', error.response.headers);
    } else if (error.request) {
      console.error('❌ [API] No Response Received:', error.request);
    } else {
      console.error('❌ [API] Request Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

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
let csrfFetchAttempts = 0;
const MAX_CSRF_ATTEMPTS = 3;

const ensureCsrfCookie = async (): Promise<void> => {
  csrfFetchAttempts++;
  console.log(`🔄 [CSRF] Attempt ${csrfFetchAttempts} - Checking for XSRF-TOKEN cookie...`);
  console.log(`🔄 [CSRF] Current cookies: ${document.cookie}`);
  
  if (document.cookie.includes('XSRF-TOKEN')) {
    console.log('✅ [CSRF] XSRF-TOKEN cookie already exists');
    return;
  }
  
  if (csrfFetchAttempts > MAX_CSRF_ATTEMPTS) {
    console.error(`❌ [CSRF] Failed ${MAX_CSRF_ATTEMPTS} attempts`);
    csrfFetchAttempts = 0;
    return;
  }
  
  console.log(`🔄 [CSRF] Fetching from ${API_ROOT}/sanctum/csrf-cookie...`);
  
  try {
    const response = await axios.get(`${API_ROOT}/sanctum/csrf-cookie`, {
      withCredentials: true,
      headers: {
        'Accept': 'application/json',
      },
    });
    console.log('✅ [CSRF] Cookie fetched successfully');
    console.log(`✅ [CSRF] Response status: ${response.status}`);
    console.log(`✅ [CSRF] Response headers:`, response.headers);
    console.log(`✅ [CSRF] New cookies: ${document.cookie}`);
    csrfFetchAttempts = 0;
  } catch (error: any) {
    console.error(`❌ [CSRF] Failed to fetch cookie:`, error);
    if (error.response) {
      console.error(`❌ [CSRF] Status: ${error.response.status}`);
      console.error(`❌ [CSRF] Data:`, error.response.data);
    }
    throw error;
  }
};

api.interceptors.request.use(async (config) => {
  const method = (config.method || 'get').toLowerCase();
  console.log(`🔍 [Interceptor] ${method.toUpperCase()} ${config.url}`);
  
  if (method !== 'get') {
    console.log(`🔄 [Interceptor] Non-GET request, ensuring CSRF...`);
    try {
      await ensureCsrfCookie();
      console.log(`✅ [Interceptor] CSRF check passed for ${config.url}`);
    } catch (error) {
      console.error(`❌ [Interceptor] CSRF check failed for ${config.url}:`, error);
      throw error;
    }
  } else {
    console.log(`⏭️ [Interceptor] GET request, skipping CSRF`);
  }
  
  return config;
});

// No response-side cleanup needed anymore on 401 — there's no client-side
// token/user snapshot to clear. AuthContext re-checks /auth/user and reacts
// to the 401 itself.
api.interceptors.response.use(
  (response) => {
    console.log(`✅ [Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`❌ [Response Error] ${error.response.status} ${error.response.config.url}`);
      console.error(`❌ [Response Error] Data:`, error.response.data);
    }
    return Promise.reject(error);
  }
);

// ✅ Debug: Log when api is fully initialized
console.log('✅ [API] Fully initialized with debug logging enabled');

export default api;
