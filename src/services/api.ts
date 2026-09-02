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
 * FIX: CSRF cookie management — using an in-memory flag instead of 
 * document.cookie (which can't read cross-origin cookies anyway).
 * 
 * The old code checked document.cookie.includes('XSRF-TOKEN'), which
 * will ALWAYS be empty for cross-origin requests (browser security).
 * This was never a valid check. Now we use a simple in-memory flag.
 */
let csrfFetched = false;
let csrfFetchAttempts = 0;
const MAX_CSRF_ATTEMPTS = 3;

const ensureCsrfCookie = async (): Promise<void> => {
  // ✅ Use in-memory flag instead of document.cookie
  if (csrfFetched) {
    console.log('✅ [CSRF] Already fetched this session');
    return;
  }
  
  csrfFetchAttempts++;
  console.log(`🔄 [CSRF] Attempt ${csrfFetchAttempts} - Fetching CSRF cookie...`);
  
  if (csrfFetchAttempts > MAX_CSRF_ATTEMPTS) {
    console.error(`❌ [CSRF] Failed ${MAX_CSRF_ATTEMPTS} attempts, resetting`);
    csrfFetchAttempts = 0;
    csrfFetched = false;
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
    
    // ✅ IMPORTANT: Check Set-Cookie header in Network tab, NOT document.cookie
    // document.cookie will ALWAYS be empty for cross-origin cookies
    if (response.headers['set-cookie']) {
      console.log('✅ [CSRF] Set-Cookie header present:', response.headers['set-cookie']);
    } else {
      console.log('⚠️ [CSRF] No Set-Cookie header (check Network tab)');
    }
    
    csrfFetched = true;
    csrfFetchAttempts = 0;
  } catch (error: any) {
    console.error(`❌ [CSRF] Failed to fetch cookie:`, error);
    if (error.response) {
      console.error(`❌ [CSRF] Status: ${error.response.status}`);
      console.error(`❌ [CSRF] Data:`, error.response.data);
    }
    csrfFetched = false;
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

// ✅ Response interceptor - reset CSRF flag on 419
api.interceptors.response.use(
  (response) => {
    console.log(`✅ [Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`❌ [Response Error] ${error.response.status} ${error.response.config.url}`);
      console.error(`❌ [Response Error] Data:`, error.response.data);
      
      // ✅ Reset CSRF flag on 419 so next request retries
      if (error.response.status === 419) {
        console.log('🔄 [CSRF] 419 received, resetting CSRF flag...');
        csrfFetched = false;
      }
    }
    return Promise.reject(error);
  }
);

// ✅ Debug: Log when api is fully initialized
console.log('✅ [API] Fully initialized with debug logging enabled');

export default api;
