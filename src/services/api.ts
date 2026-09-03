import axios from 'axios';

// Empty API_ROOT allows requests to default to the current host (Vercel on prod, localhost in dev)
const API_ROOT = '';
const API_BASE_URL = `${API_ROOT}/api/v1`;

console.log('🔧 [API] Initialized with base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // send/receive session + XSRF cookies
  withXSRFToken: true,   // auto-reads XSRF-TOKEN cookie & sends X-XSRF-TOKEN header
});

// ✅ Debug: Log all outgoing requests
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

// ✅ Debug: Log all incoming responses
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
 * CSRF cookie management using relative path via Vercel / Vite proxy
 */
let csrfFetched = false;
let csrfFetchAttempts = 0;
const MAX_CSRF_ATTEMPTS = 3;

const ensureCsrfCookie = async (): Promise<void> => {
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

  console.log(`🔄 [CSRF] Fetching from /sanctum/csrf-cookie...`);

  try {
    const response = await axios.get('/sanctum/csrf-cookie', {
      withCredentials: true,
      headers: {
        Accept: 'application/json',
      },
    });
    console.log('✅ [CSRF] Cookie fetched successfully');
    console.log(`✅ [CSRF] Response status: ${response.status}`);

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

// ✅ Request Interceptor: Ensure CSRF cookie exists before state-mutating requests
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

// ✅ Response Interceptor: Reset CSRF flag on 419 error
api.interceptors.response.use(
  (response) => {
    console.log(`✅ [Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`❌ [Response Error] ${error.response.status} ${error.response.config.url}`);
      console.error(`❌ [Response Error] Data:`, error.response.data);

      if (error.response.status === 419) {
        console.log('🔄 [CSRF] 419 received, resetting CSRF flag...');
        csrfFetched = false;
      }
    }
    return Promise.reject(error);
  }
);

console.log('✅ [API] Fully initialized with debug logging enabled');

export default api;
