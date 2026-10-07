import { useState, useCallback, useEffect, useRef } from 'react';
import { videoAccessService } from '../services/videoAccessService';
import type {
  VideoStatusResponse,
  VideoStartResponse,
} from '../services/videoAccessService';
import { getVideoTokenErrorLabel } from '../utils/videoTokenHelpers';

/**
 * Full lifecycle of a video-viewing session.
 *
 * Flow:
 *   1. On mount → `fetchStatus()` (no consumption)
 *   2. On user Play → `startView()` (consumes 1 view, idempotent within 5 min)
 *   3. `streamUrl` → for <video src="...">
 *
 * Error codes handled:
 *   - TOKEN_NOT_FOUND / TOKEN_REVOKED / TOKEN_EXPIRED / TOKEN_EXHAUSTED
 *   - TOKEN_IP_MISMATCH / STREAM_WITHOUT_START
 */
export const useVideoAccess = (token: string | undefined) => {
  const [status, setStatus] = useState<VideoStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [errorCode, setErrorCode] = useState<string | undefined>(undefined);

  // Only mark "started" AFTER the backend confirms a successful start.
  const startedRef = useRef(false);

  // ============================================
  // Fetch status
  // ============================================
  const fetchStatus = useCallback(async () => {
    if (!token) {
      setErrorCode('TOKEN_NOT_FOUND');
      setLoading(false);
      return null;
    }

    try {
      setLoading(true);
      setErrorCode(undefined);
      const data = await videoAccessService.getStatus(token);
      setStatus(data);
      return data;
    } catch (error: any) {
      const httpStatus = error.response?.status;
      const code = error.response?.data?.error_code;

      if (httpStatus === 404) {
        setErrorCode(code || 'TOKEN_NOT_FOUND');
      } else if (httpStatus === 410) {
        setErrorCode(code || 'TOKEN_EXHAUSTED');
      } else if (httpStatus === 403) {
        setErrorCode(code || 'TOKEN_IP_MISMATCH');
      } else {
        setErrorCode('UNKNOWN_ERROR');
      }
      setStatus(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ============================================
  // Start view
  // ============================================
  const startView = useCallback(async (): Promise<VideoStartResponse | null> => {
    if (!token) return null;
    if (startedRef.current) return null;

    try {
      setStarting(true);
      const data = await videoAccessService.startView(token);
      startedRef.current = true;

      setStatus((prev) =>
        prev
          ? {
              ...prev,
              views_used: data.views_used,
              max_views: data.max_views,
              remaining: data.remaining,
            }
          : prev
      );

      return data;
    } catch (error: any) {
      const httpStatus = error.response?.status;
      const code = error.response?.data?.error_code;

      if (httpStatus === 404) {
        setErrorCode(code || 'TOKEN_NOT_FOUND');
      } else if (httpStatus === 410) {
        setErrorCode(code || 'TOKEN_EXHAUSTED');
      } else if (httpStatus === 403) {
        setErrorCode(code || 'TOKEN_IP_MISMATCH');
      } else {
        setErrorCode('UNKNOWN_ERROR');
      }
      // Do NOT set startedRef → user can retry
      return null;
    } finally {
      setStarting(false);
    }
  }, [token]);

  // ============================================
  // Reset
  // ============================================
  const reset = useCallback(() => {
    startedRef.current = false;
    setStatus(null);
    setErrorCode(undefined);
    setLoading(true);
  }, []);

  // ============================================
  // Auto-fetch on mount / token change
  // ============================================
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Reset when token changes
  useEffect(() => {
    startedRef.current = false;
    setErrorCode(undefined);
    setStatus(null);
    setLoading(true);
  }, [token]);

  // ============================================
  // Derived values
  // ============================================
  const isPlayable = !!status && !errorCode;
  const hasError = !!errorCode;
  const errorLabel = errorCode ? getVideoTokenErrorLabel(errorCode) : '';
  const streamUrl =
    isPlayable && token ? videoAccessService.getStreamUrl(token) : '';
  const hasStarted = startedRef.current;

  return {
    // State
    status,
    loading,
    starting,
    errorCode,
    errorLabel,
    isPlayable,
    hasError,
    hasStarted,

    // Stream URL
    streamUrl,

    // Actions
    fetchStatus,
    startView,
    reset,
  };
};

export default useVideoAccess;