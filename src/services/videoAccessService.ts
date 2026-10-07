import api from './api';

/**
 * Video Access Service
 * ═══════════════════════════════════════════════════════════
 * Public endpoints (no auth):
 *   GET  /donations/video/status?token=xxx   → validate, no consumption
 *   POST /donations/video/start?token=xxx    → consume 1 view (5-min window)
 *   GET  /donations/video/stream?token=xxx   → stream, no counting
 *
 * All three accept the token as a QUERY STRING parameter.
 * ═══════════════════════════════════════════════════════════
 */

// ============================================
// Token types (matches backend ENUM)
// ============================================
export type VideoTokenType = 'donor_inquiry' | 'admin_custom';

// ============================================
// Status response
// ============================================
export interface VideoStatusResponse {
  valid: true;
  token_type: VideoTokenType;
  views_used: number;
  max_views: number;
  remaining: number;
  expires_at: string;
  first_accessed: string | null;
  /** Blurred thumbnail URL to show before the user starts the video */
  thumbnail_blurred_url: string | null;
}

export interface VideoStatusError {
  valid: false;
  error_code?: string;
  message?: string;
}

// ============================================
// Start response
// ============================================
export interface VideoStartResponse {
  started: true;
  consumed: boolean;
  views_used: number;
  max_views: number;
  remaining: number;
  window_expires_at: string;
}

export interface VideoStartError {
  started: false;
  error_code?: string;
  message?: string;
}

// ============================================
// Service
// ============================================
export const videoAccessService = {
  /**
   * GET /v1/donations/video/status?token=xxx
   * Safe to call repeatedly — does NOT consume a view.
   */
  getStatus: async (token: string): Promise<VideoStatusResponse> => {
    const response = await api.get<VideoStatusResponse>(
      '/v1/donations/video/status',
      { params: { token } }
    );
    return response.data;
  },

  /**
   * POST /v1/donations/video/start?token=xxx
   * Consumes 1 view. Idempotent within 5-minute window.
   */
  startView: async (token: string): Promise<VideoStartResponse> => {
    const response = await api.post<VideoStartResponse>(
      '/v1/donations/video/start',
      null,
      { params: { token } }
    );
    return response.data;
  },

  /**
   * Build the URL for `<video src="...">`.
   * Token is passed as a query string parameter.
   */
  getStreamUrl: (token: string): string => {
    const isLocal =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1');

    const base = isLocal ? 'http://localhost:8000/api/' : '/api/';
    const params = new URLSearchParams({ token });
    return `${base}v1/donations/video/stream?${params.toString()}`;
  },
};

export default videoAccessService;