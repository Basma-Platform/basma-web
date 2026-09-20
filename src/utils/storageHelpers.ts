/**
 * ============================================
 * Storage URL Resolution
 * ============================================
 *
 * This is the SINGLE source of truth for building
 * URLs to files stored on the backend (images, avatars,
 * announcement covers, transfer receipts, etc.).
 *
 * Environment behavior:
 *   • Local dev  : VITE_STORAGE_URL is unset → fallback to http://localhost:8000/storage
 *   • Vercel prod: VITE_STORAGE_URL = "/storage" → Vercel rewrite → Render backend
 *   • Custom     : VITE_STORAGE_URL = "https://..." → used as-is
 *
 * Backend responds with paths like:
 *   - "profile_images/user_5.jpg"
 *   - "announcements/img1.jpg"
 *   - "storage/announcements/img1.jpg"  (legacy, double-prefixed)
 *   - "https://external.com/image.jpg"  (absolute URL — returned as-is)
 */

// ============================================
// Base URL Resolution
// ============================================

/**
 * The base URL for all storage assets.
 * Trailing slash is stripped for consistent concatenation.
 */
export const STORAGE_BASE_URL: string = (() => {
  const fromEnv = import.meta.env.VITE_STORAGE_URL as string | undefined;

  // Fallback for local dev
  const base = fromEnv && fromEnv.trim().length > 0
    ? fromEnv.trim()
    : 'http://localhost:8000/storage';

  // Strip trailing slash to avoid double slashes
  return base.replace(/\/+$/, '');
})();

// ============================================
// Path Normalization
// ============================================

/**
 * Clean up a stored path so we don't double-prefix.
 *
 * Handles:
 *   "profile_images/user_5.jpg"           → "profile_images/user_5.jpg"
 *   "/profile_images/user_5.jpg"          → "profile_images/user_5.jpg"
 *   "storage/profile_images/user_5.jpg"   → "profile_images/user_5.jpg"
 *   "public/profile_images/user_5.jpg"    → "profile_images/user_5.jpg"
 */
const normalizePath = (path: string): string => {
  let p = path.trim();

  // Strip leading slashes
  p = p.replace(/^\/+/, '');

  // Strip legacy "storage/" prefix
  if (p.startsWith('storage/')) {
    p = p.slice('storage/'.length);
  }

  // Strip legacy "public/" prefix
  if (p.startsWith('public/')) {
    p = p.slice('public/'.length);
  }

  return p;
};

// ============================================
// Public API
// ============================================

/**
 * Build a full URL to a storage asset.
 *
 * @param path  The path stored in the DB (may be null/undefined/empty)
 * @param fallback  Optional fallback URL if path is empty
 * @returns The full URL, or null if path is empty and no fallback is provided
 *
 * @example
 *   getStorageUrl('profile_images/user_5.jpg')
 *     // → "http://localhost:8000/storage/profile_images/user_5.jpg" (local)
 *     // → "/storage/profile_images/user_5.jpg"                     (Vercel)
 *
 *   getStorageUrl(null)
 *     // → null
 *
 *   getStorageUrl(null, '/default-avatar.png')
 *     // → "/default-avatar.png"
 *
 *   getStorageUrl('https://example.com/img.jpg')
 *     // → "https://example.com/img.jpg" (absolute — kept as-is)
 */
export const getStorageUrl = (
  path: string | null | undefined,
  fallback?: string
): string | null => {
  // Empty → return fallback (or null)
  if (!path || path.trim().length === 0) {
    return fallback ?? null;
  }

  const trimmed = path.trim();

  // Absolute URLs are returned as-is (external images, CDNs, etc.)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Relative path → prepend the base URL
  const normalized = normalizePath(trimmed);
  return `${STORAGE_BASE_URL}/${normalized}`;
};

/**
 * Same as getStorageUrl but always returns a string.
 * If no path is provided, returns the fallback (which is required).
 *
 * @example
 *   getStorageUrlOr('profile_images/user_5.jpg', '/default-avatar.png')
 *     // → "http://localhost:8000/storage/profile_images/user_5.jpg"
 *
 *   getStorageUrlOr(null, '/default-avatar.png')
 *     // → "/default-avatar.png"
 */
export const getStorageUrlOr = (
  path: string | null | undefined,
  fallback: string
): string => {
  return getStorageUrl(path, fallback) ?? fallback;
};

/**
 * Check if a string is likely a storage path (and not a full URL).
 */
export const isStoragePath = (path: string | null | undefined): boolean => {
  if (!path || path.trim().length === 0) return false;
  const trimmed = path.trim();
  return !trimmed.startsWith('http://') && !trimmed.startsWith('https://');
};

// ============================================
// Default export for convenience
// ============================================

export default {
  getStorageUrl,
  getStorageUrlOr,
  isStoragePath,
  STORAGE_BASE_URL,
};