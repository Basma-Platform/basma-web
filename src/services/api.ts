import axios from 'axios';
import { translateBackendMessage } from '../utils/helpRequestErrorMessages';

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
  withCredentials: true,
  withXSRFToken: true,
});

// ============================================
// Account Status (suspended / blocked) — global trigger
// ============================================
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

  if (handler && pendingAccountStatusEvent) {
    const buffered = pendingAccountStatusEvent;
    pendingAccountStatusEvent = null;
    console.log('🎯 [AccountStatus] Flushing buffered event:', buffered);
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

// ============================================
// ✅ Auto-Translate Helper
// ============================================
/**
 * Translate any backend English `message` code → Arabic.
 *
 * Handles:
 *   - `data.message`          → translated
 *   - `data.errors` (422)     → each field's messages translated
 *   - `error_code` fallback   → if `message` is missing but code exists
 */
const autoTranslateResponse = (data: any): any => {
  if (!data || typeof data !== 'object') return data;

  // ── Translate `message` ──
  if (typeof data.message === 'string' && data.message.length > 0) {
    const code = data.error_code || data.message;
    data.message = translateBackendMessage(data.message, code);
  }

  // ── Translate `error_code` if present and no message ──
  if (
    !data.message &&
    typeof data.error_code === 'string' &&
    data.error_code.length > 0
  ) {
    data.message = translateBackendMessage(
      data.error_code,
      data.error_code
    );
  }

  // ── Translate nested `errors` object (422 validation) ──
  if (data.errors && typeof data.errors === 'object') {
    const translatedErrors: Record<string, string[]> = {};
    for (const [key, value] of Object.entries(data.errors)) {
      if (Array.isArray(value)) {
        translatedErrors[key] = value.map((msg) =>
          typeof msg === 'string'
            ? translateBackendMessage(msg, msg)
            : String(msg)
        );
      } else if (typeof value === 'string') {
        translatedErrors[key] = [translateBackendMessage(value, value)];
      } else {
        translatedErrors[key] = [String(value)];
      }
    }
    data.errors = translatedErrors;
  }

  return data;
};

// ============================================
// Request Interceptor — debug logging
// ============================================
api.interceptors.request.use(
  (config) => {
    console.log(`📤 [API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ [API] Request Error:', error);
    return Promise.reject(error);
  }
);

// ============================================
// ✅ MAIN Response Interceptor — auto-translate + debug logging
// ============================================
api.interceptors.response.use(
  (response) => {
    console.log(`📥 [API] ${response.status} ${response.config.url}`);
    console.log('📥 [API] Response (raw):', response.data);

    // ✅ Auto-translate backend messages
    if (response.data) {
      response.data = autoTranslateResponse(response.data);
      console.log('📥 [API] Response (translated):', response.data);
    }

    return response;
  },
  (error) => {
    if (error.response) {
      console.error(
        `❌ [API] Response Error ${error.response.status}: ${error.response.config?.url}`
      );
      console.error('❌ [API] Error Data (raw):', error.response.data);

      // ✅ Auto-translate error messages
      if (error.response.data) {
        error.response.data = autoTranslateResponse(error.response.data);
        console.error(
          '❌ [API] Error Data (translated):',
          error.response.data
        );
      }
    } else if (error.request) {
      console.error('❌ [API] No Response Received:', error.request);
    } else {
      console.error('❌ [API] Request Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// ============================================
// CSRF cookie management
// ============================================
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

// ============================================
// Request Interceptor — CSRF for non-GET
// ============================================
api.interceptors.request.use(async (config) => {
  const method = (config.method || 'get').toLowerCase();

  if (method !== 'get') {
    try {
      await ensureCsrfCookie();
    } catch (error) {
      console.error(
        `❌ [Interceptor] CSRF check failed for ${config.url}:`,
        error
      );
      throw error;
    }
  }

  return config;
});

// ============================================
// Response Interceptor — reset CSRF on 419
// ============================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 419) {
      console.log('🔄 [CSRF] 419 received, resetting CSRF flag...');
      csrfFetched = false;
    }
    return Promise.reject(error);
  }
);

// ============================================
// Account Status Interceptor
// ============================================
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

console.log('✅ [API] Fully initialized with auto-translate + debug logging');

export default api;