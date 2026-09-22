import axios from 'axios';

// know the evn if we works locally use Laravel server localhost:8000
// and if we on vercel use the deployment path vercel .. vercel "backend" in the way changed to onrender...
// his follow rules in vercel.json

const isLocal =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1');

const API_BASE_URL = isLocal ? 'http://localhost:8000/api/' : '/api/';

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

// ============================================
// Account Status (suspended / blocked) — global trigger
// ============================================
// The response interceptor can't use React hooks, so we expose a
// module-level callback that AccountStatusProvider registers itself into.
// When any API call returns 403 with ACCOUNT_SUSPENDED / ACCOUNT_BLOCKED,
// we invoke this handler → which opens the global AccountStatusModal.
//
// To survive the React StrictMode race (provider mounts → unmounts →
// remounts) and the case where a request fires BEFORE the provider has
// registered its handler, we BUFFER the last event and flush it the
// moment a handler is registered.
type AccountErrorCode = 'ACCOUNT_SUSPENDED' | 'ACCOUNT_BLOCKED';

interface AccountStatusEvent {
  code: AccountErrorCode;
  extras?: {
    message?: string;
    suspended_until?: string;
    days_remaining?: number;
    fromSession?: boolean;
  };
}

type AccountStatusHandler = (event: AccountStatusEvent) => void;

let accountStatusHandler: AccountStatusHandler | null = null;
let pendingAccountStatusEvent: AccountStatusEvent | null = null;

export const registerAccountStatusHandler = (
  handler: AccountStatusHandler | null
) => {
  console.log(
    '🎯 [AccountStatus] registerAccountStatusHandler called with:',
    handler ? 'HANDLER' : 'NULL'
  );
  accountStatusHandler = handler;

  // Flush any event that arrived while no handler was registered
  if (handler && pendingAccountStatusEvent) {
    const buffered = pendingAccountStatusEvent;
    pendingAccountStatusEvent = null;
    console.log(
      '🎯 [AccountStatus] Flushing buffered event:',
      buffered
    );
    // Defer to next tick so the provider's state is settled
    setTimeout(() => handler(buffered), 0);
  }
};

const dispatchAccountStatus = (event: AccountStatusEvent) => {
  console.log('🎯 [AccountStatus] Dispatching event:', event);
  if (accountStatusHandler) {
    console.log('🎯 [AccountStatus] Handler registered → firing now');
    accountStatusHandler(event);
  } else {
    console.log('🎯 [AccountStatus] No handler yet → buffering');
    pendingAccountStatusEvent = event;
  }
};

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
      console.error(
        `❌ [API] Response Error ${error.response.status}: ${error.response.config.url}`
      );
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
 * CSRF cookie management.
 * ديناميكي بالكامل: محلياً يطلب الكوكيز من localhost:8000، وفي الإنتاج يطلبها نسبياً.
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
  console.log(
    `🔄 [CSRF] Attempt ${csrfFetchAttempts} - Fetching CSRF cookie...`
  );

  if (csrfFetchAttempts > MAX_CSRF_ATTEMPTS) {
    console.error(`❌ [CSRF] Failed ${MAX_CSRF_ATTEMPTS} attempts, resetting`);
    csrfFetchAttempts = 0;
    csrfFetched = false;
    return;
  }

  const csrfUrl = isLocal
    ? 'http://localhost:8000/sanctum/csrf-cookie'
    : '/sanctum/csrf-cookie';
  console.log(`🔄 [CSRF] Fetching from ${csrfUrl}...`);

  try {
    const response = await axios.get(csrfUrl, {
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
      console.error(
        `❌ [Interceptor] CSRF check failed for ${config.url}:`,
        error
      );
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
      console.error(
        `❌ [Response Error] ${error.response.status} ${error.response.config.url}`
      );
      console.error(`❌ [Response Error] Data:`, error.response.data);

      if (error.response.status === 419) {
        console.log('🔄 [CSRF] 419 received, resetting CSRF flag...');
        csrfFetched = false;
      }
    }
    return Promise.reject(error);
  }
);

// ============================================
// Account Status Interceptor
// ============================================
// Catches 403s with ACCOUNT_SUSPENDED / ACCOUNT_BLOCKED from ANY request
// (login, /auth/user, mid-session API calls) and triggers the global
// AccountStatusModal via the registered handler.
//
// We BUFFER the event if the handler isn't registered yet (React StrictMode
// race, or a request that fires before the provider's effect runs), and
// flush the buffer the moment a handler arrives.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    const errorCode = data?.error_code as AccountErrorCode | undefined;

    console.log(
      `🎯 [AccountStatus] Interceptor saw error — status: ${status}, code: ${errorCode}`
    );

    if (
      status === 403 &&
      (errorCode === 'ACCOUNT_SUSPENDED' || errorCode === 'ACCOUNT_BLOCKED')
    ) {
      dispatchAccountStatus({
        code: errorCode,
        extras: {
          message: data?.message,
          suspended_until: data?.suspended_until,
          days_remaining: data?.days_remaining,
          fromSession: true,
        },
      });
    }

    return Promise.reject(error);
  }
);

console.log('✅ [API] Fully initialized with debug logging enabled');

export default api;