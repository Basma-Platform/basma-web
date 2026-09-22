import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { AccountErrorCode } from '../types';
import { ACCOUNT_STATUS_STORAGE_KEY } from '../utils/warningHelpers';
import { registerAccountStatusHandler } from '../services/api';

// ============================================
// Types
// ============================================

export interface AccountStatusPayload {
  variant: 'suspended' | 'blocked';
  message?: string;
  suspended_until?: string | null;
  days_remaining?: number;
  /** If true, this was triggered by an API 403 mid-session */
  fromSession?: boolean;
}

interface AccountStatusContextValue {
  status: AccountStatusPayload | null;
  showStatus: (payload: AccountStatusPayload) => void;
  dismiss: () => void;
  /**
   * Suppress modal openings for a short window (default 3s).
   * Used to prevent the modal from re-opening while we're logging out.
   * Auto-clears after the window so future 403s (e.g. next login attempt)
   * still open the modal.
   */
  suppress: (durationMs?: number) => void;
  /** Manually clear suppression (e.g. when LoginPage mounts). */
  unsuppress: () => void;
  showFromErrorCode: (
    code?: AccountErrorCode,
    extras?: Partial<AccountStatusPayload>
  ) => void;
}

const AccountStatusContext = createContext<
  AccountStatusContextValue | undefined
>(undefined);

// Default suppression window: 3 seconds
const DEFAULT_SUPPRESS_MS = 3000;

// ============================================
// Provider
// ============================================

interface AccountStatusProviderProps {
  children: ReactNode;
}

export const AccountStatusProvider = ({
  children,
}: AccountStatusProviderProps) => {
  const [status, setStatus] = useState<AccountStatusPayload | null>(null);

  // ✅ Suppress until this timestamp. Auto-clears when Date.now() passes it.
  // This avoids the "suppress flag stuck forever" bug where a suspended
  // user could never see the modal again after being auto-logged-out.
  const suppressUntilRef = useRef<number>(0);
  const suppressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ------------------------------------------------------------
  // Restore from localStorage on mount
  // ------------------------------------------------------------
  useEffect(() => {
    try {
      const raw = localStorage.getItem(ACCOUNT_STATUS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AccountStatusPayload;
        if (parsed?.variant) {
          setStatus(parsed);
        }
      }
    } catch {
      // ignore malformed storage
    }
  }, []);

  // ------------------------------------------------------------
  // Persist helper
  // ------------------------------------------------------------
  const persist = useCallback((payload: AccountStatusPayload | null) => {
    try {
      if (payload) {
        localStorage.setItem(
          ACCOUNT_STATUS_STORAGE_KEY,
          JSON.stringify(payload)
        );
      } else {
        localStorage.removeItem(ACCOUNT_STATUS_STORAGE_KEY);
      }
    } catch {
      // ignore quota errors
    }
  }, []);

  // ------------------------------------------------------------
  // Public actions
  // ------------------------------------------------------------
  const showStatus = useCallback(
    (payload: AccountStatusPayload) => {
      // ✅ Check time-based suppression
      if (Date.now() < suppressUntilRef.current) {
        // eslint-disable-next-line no-console
        console.log(
          '🎯 [AccountStatus] showStatus suppressed (still in suppression window)'
        );
        return;
      }

      console.log('🎯 [AccountStatus] showStatus called:', payload);
      setStatus(payload);
      persist(payload);
    },
    [persist]
  );

  const dismiss = useCallback(() => {
    console.log('🎯 [AccountStatus] dismiss called');
    setStatus(null);
    persist(null);
  }, [persist]);

  /**
   * Suppress modal openings for `durationMs` (default 3s).
   * Auto-clears after the window so future 403s still open the modal.
   */
  const suppress = useCallback((durationMs: number = DEFAULT_SUPPRESS_MS) => {
    const until = Date.now() + durationMs;
    suppressUntilRef.current = until;

    console.log(
      `🎯 [AccountStatus] suppress called for ${durationMs}ms (until ${new Date(
        until
      ).toISOString()})`
    );

    // Clear any existing timer
    if (suppressTimerRef.current) {
      clearTimeout(suppressTimerRef.current);
    }

    // Auto-clear after the window
    suppressTimerRef.current = setTimeout(() => {
      suppressUntilRef.current = 0;
      suppressTimerRef.current = null;
      console.log('🎯 [AccountStatus] suppress window expired');
    }, durationMs);
  }, []);

  const unsuppress = useCallback(() => {
    console.log('🎯 [AccountStatus] unsuppress called');
    suppressUntilRef.current = 0;
    if (suppressTimerRef.current) {
      clearTimeout(suppressTimerRef.current);
      suppressTimerRef.current = null;
    }
  }, []);

  const showFromErrorCode = useCallback(
    (
      code?: AccountErrorCode,
      extras?: Partial<AccountStatusPayload>
    ) => {
      if (!code) return;

      console.log(
        '🎯 [AccountStatus] showFromErrorCode called:',
        code,
        extras
      );

      if (code === 'ACCOUNT_SUSPENDED') {
        showStatus({
          variant: 'suspended',
          suspended_until: extras?.suspended_until ?? null,
          days_remaining: extras?.days_remaining,
          message: extras?.message,
          fromSession: extras?.fromSession,
        });
      } else if (code === 'ACCOUNT_BLOCKED') {
        showStatus({
          variant: 'blocked',
          message: extras?.message,
          fromSession: extras?.fromSession,
        });
      }
    },
    [showStatus]
  );

  // ------------------------------------------------------------
  // Register with the API interceptor
  // ------------------------------------------------------------
  useEffect(() => {
    console.log(
      '🎯 [AccountStatus] Registering handler with API interceptor'
    );
    registerAccountStatusHandler((event) => {
      console.log('🎯 [AccountStatus] Handler fired with event:', event);
      showFromErrorCode(event.code, event.extras);
    });
    return () => {
      console.log(
        '🎯 [AccountStatus] Unregistering handler from API interceptor'
      );
      registerAccountStatusHandler(null);
    };
  }, [showFromErrorCode]);

  // ------------------------------------------------------------
  // Cleanup timer on unmount
  // ------------------------------------------------------------
  useEffect(() => {
    return () => {
      if (suppressTimerRef.current) {
        clearTimeout(suppressTimerRef.current);
      }
    };
  }, []);

  return (
    <AccountStatusContext.Provider
      value={{
        status,
        showStatus,
        dismiss,
        suppress,
        unsuppress,
        showFromErrorCode,
      }}
    >
      {children}
    </AccountStatusContext.Provider>
  );
};

// ============================================
// Hook
// ============================================

// eslint-disable-next-line react-refresh/only-export-components
export const useAccountStatus = () => {
  const ctx = useContext(AccountStatusContext);
  if (!ctx) {
    throw new Error(
      'useAccountStatus must be used inside <AccountStatusProvider>'
    );
  }
  return ctx;
};

export default AccountStatusContext;