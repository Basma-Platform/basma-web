import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import { notificationService } from '../services/notificationService';
import { useAuth } from '../hooks/useAuth';

// ============================================
// Adaptive Polling Config
// ============================================
const POLLING_INTERVALS = {
  RECENTLY_ACTIVE: 15_000,  // 15s — نشط جداً
  ACTIVE: 30_000,           // 30s — نشط
  IDLE: 60_000,             // 60s — خامل
  VERY_IDLE: 300_000,       // 5min — خامل جداً
  ERROR_BASE: 1_000,        // 1s — للأخطاء
  ERROR_MAX: 30_000,        // 30s — حد أقصى للأخطاء
};

const MIN_FETCH_INTERVAL = 5_000; // 5s — منع الطلبات المتكررة

// ============================================
// Context Value
// ============================================
interface NotificationsContextValue {
  unreadCount: number;
  isPolling: boolean;
  fetchUnreadCount: () => Promise<number | void>;
  refreshUnreadCount: () => Promise<void>;
  markUnreadCount: (count: number) => void;
  startPolling: () => void;
  stopPolling: () => void;
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(
  undefined
);

// ============================================
// Provider
// ============================================
export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();

  const [unreadCount, setUnreadCount] = useState(0);
  const [isPolling, setIsPolling] = useState(false);

  // Refs (avoid re-renders)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPollingRef = useRef(false);
  const lastActivityRef = useRef<number>(Date.now());
  const lastFetchRef = useRef<number>(0);
  const errorCountRef = useRef<number>(0);

  // ============================================
  // Update last activity
  // ============================================
  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  // ============================================
  // Calculate next interval
  // ============================================
  const getNextInterval = useCallback((): number => {
    // Errors → exponential backoff
    if (errorCountRef.current > 0) {
      return Math.min(
        POLLING_INTERVALS.ERROR_BASE *
          Math.pow(2, errorCountRef.current - 1),
        POLLING_INTERVALS.ERROR_MAX
      );
    }

    // Activity-based
    const secondsSinceActivity =
      (Date.now() - lastActivityRef.current) / 1000;

    if (secondsSinceActivity < 60) return POLLING_INTERVALS.RECENTLY_ACTIVE;
    if (secondsSinceActivity < 300) return POLLING_INTERVALS.ACTIVE;
    if (secondsSinceActivity < 1800) return POLLING_INTERVALS.IDLE;
    return POLLING_INTERVALS.VERY_IDLE;
  }, []);

  // ============================================
  // Fetch unread count
  // ============================================
  const fetchUnreadCount = useCallback(async (): Promise<number | void> => {
    // Skip if not authenticated
    if (!isAuthenticated) return;

    // Throttle — avoid too frequent calls
    const now = Date.now();
    if (now - lastFetchRef.current < MIN_FETCH_INTERVAL) {
      return unreadCount;
    }

    try {
      const response = await notificationService.getUnreadCount();
      setUnreadCount(response.count);
      errorCountRef.current = 0;
      lastFetchRef.current = now;
      return response.count;
    } catch (error: any) {
      // Silent on 401
      if (error.response?.status === 401) {
        return;
      }
      errorCountRef.current++;
      // Silent — polling shouldn't spam
      console.warn('Failed to fetch unread count:', error);
    }
  }, [isAuthenticated, unreadCount]);

  // ============================================
  // Manual refresh (bypasses throttle)
  // ============================================
  const refreshUnreadCount = useCallback(async () => {
    lastFetchRef.current = 0;
    await fetchUnreadCount();
  }, [fetchUnreadCount]);

  // ============================================
  // Mark count manually
  // ============================================
  const markUnreadCount = useCallback((count: number) => {
    setUnreadCount(Math.max(0, count));
  }, []);

  // ============================================
  // Polling Loop
  // ============================================
  const scheduleNext = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const delay = getNextInterval();

    timerRef.current = setTimeout(async () => {
      // Stop if polling was disabled
      if (!isPollingRef.current) return;

      // Stop if not authenticated
      if (!isAuthenticated) {
        isPollingRef.current = false;
        setIsPolling(false);
        return;
      }

      // Skip when tab is hidden — reschedule
      if (document.hidden) {
        scheduleNext();
        return;
      }

      try {
        await fetchUnreadCount();
      } catch {
        // Handled inside fetchUnreadCount
      }

      scheduleNext();
    }, delay);
  }, [getNextInterval, fetchUnreadCount, isAuthenticated]);

  // ============================================
  // Start / Stop Polling
  // ============================================
  const startPolling = useCallback(() => {
    if (!isAuthenticated) return;
    if (isPollingRef.current) return;

    isPollingRef.current = true;
    setIsPolling(true);
    scheduleNext();
  }, [isAuthenticated, scheduleNext]);

  const stopPolling = useCallback(() => {
    isPollingRef.current = false;
    setIsPolling(false);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // ============================================
  // Visibility API + Activity tracking
  // ============================================
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause polling
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      } else {
        // Resume: fetch immediately + reschedule
        updateActivity();
        fetchUnreadCount();
        if (isPollingRef.current) {
          scheduleNext();
        }
      }
    };

    const handleActivity = () => {
      updateActivity();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const events = ['click', 'keydown', 'scroll', 'mousemove', 'touchstart'];
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isAuthenticated, updateActivity, fetchUnreadCount, scheduleNext]);

  // ============================================
  // Auto-start when authenticated + auto-stop on logout
  // ============================================
  useEffect(() => {
    if (isAuthenticated) {
      // Initial fetch
      fetchUnreadCount();
      // Start polling
      startPolling();
    } else {
      stopPolling();
      setUnreadCount(0);
      errorCountRef.current = 0;
      lastFetchRef.current = 0;
    }
  }, [isAuthenticated, fetchUnreadCount, startPolling, stopPolling]);

  // ============================================
  // Cleanup on unmount
  // ============================================
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        unreadCount,
        isPolling,
        fetchUnreadCount,
        refreshUnreadCount,
        markUnreadCount,
        startPolling,
        stopPolling,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

// ============================================
// Hook
// ============================================
export const useNotificationsContext = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error(
      'useNotificationsContext must be used within NotificationsProvider'
    );
  }
  return ctx;
};