// ============================================
// VIDEO TOKEN ERROR CODES
// ============================================

export type VideoTokenErrorCode =
  | 'TOKEN_EXHAUSTED'
  | 'TOKEN_EXPIRED'
  | 'TOKEN_REVOKED'
  | 'TOKEN_IP_MISMATCH'
  | 'TOKEN_NOT_FOUND'
  | 'STREAM_WITHOUT_START'
  | 'STREAM_WINDOW_EXPIRED'
  | 'video_not_available'
  | 'video_file_not_found'
  | 'UNKNOWN_ERROR';

export const getVideoTokenErrorLabel = (
  code: string | undefined
): string => {
  const map: Record<string, string> = {
    TOKEN_EXHAUSTED: 'تم استخدام هذا الرابط بالكامل',
    TOKEN_EXPIRED: 'انتهت صلاحية هذا الرابط',
    TOKEN_REVOKED: 'تم إلغاء هذا الرابط',
    TOKEN_IP_MISMATCH: 'لا يمكن فتح الفيديو من جهاز مختلف',
    TOKEN_NOT_FOUND: 'الرابط غير موجود',
    STREAM_WITHOUT_START: 'انتهت جلسة المشاهدة، يرجى إعادة المحاولة',
    STREAM_WINDOW_EXPIRED:
      'انتهت صلاحية جلسة المشاهدة، يرجى إعادة المحاولة',
    video_not_available: 'الفيديو غير متوفر',
    video_file_not_found: 'ملف الفيديو غير موجود',
    UNKNOWN_ERROR: 'حدث خطأ غير متوقع',
  };
  return code ? map[code] ?? 'حدث خطأ غير متوقع' : 'حدث خطأ غير متوقع';
};

export const getVideoTokenErrorHint = (
  code: string | undefined
): string => {
  const map: Record<string, string> = {
    TOKEN_EXHAUSTED:
      'تواصل مع المنصة للحصول على رابط جديد أو لمزيد من المعلومات.',
    TOKEN_EXPIRED: 'اطلب من المنصة رابطاً جديداً إذا كنت بحاجة للمشاهدة.',
    TOKEN_REVOKED: 'تم إلغاء الرابط من قِبل الإدارة. تواصل مع المنصة.',
    TOKEN_IP_MISMATCH:
      'يُسمح بفتح الرابط من نفس الجهاز والشبكة التي تم إنشاؤه منها فقط.',
    TOKEN_NOT_FOUND: 'تأكد من صحة الرابط أو اطلب رابطاً جديداً.',
    STREAM_WITHOUT_START:
      'يجب الضغط على "تشغيل" أولاً قبل فتح الفيديو. أعد تحميل الصفحة.',
    STREAM_WINDOW_EXPIRED:
      'انتهت مدة الجلسة (5 دقائق). أعد الضغط على "تشغيل" للمحاولة مرة أخرى.',
    video_not_available: 'لا يمكن الوصول للفيديو حالياً.',
    video_file_not_found: 'تواصل مع المنصة.',
    UNKNOWN_ERROR: 'حاول مرة أخرى أو تواصل مع المنصة.',
  };
  return code ? map[code] ?? '' : '';
};

// ============================================
// READINESS WARNING
// ============================================

export const ONE_TIME_VIEW_WARNING = {
  title: '⚠️ تنبيه مهم',
  body:
    'يمكنك مشاهدة هذا الفيديو مرة واحدة فقط. لن يمكنك إعادة فتحه بعد ذلك. هل أنت مستعد للمشاهدة الآن؟',
  confirmLabel: 'مشاهدة الآن',
  cancelLabel: 'إلغاء',
} as const;

// ============================================
// ✅ SAFE DATE HELPERS — never crash on invalid input
// ============================================

/** Internal: safely parse a date string into a Date, or null. */
const safeDate = (value: string | null | undefined): Date | null => {
  if (!value) return null;
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (trimmed === '') return null;
  const date = new Date(trimmed);
  if (isNaN(date.getTime())) return null;
  return date;
};

/**
 * Format a token expiry date in Arabic.
 * Returns "غير محدد" for null / undefined / invalid dates.
 */
export const formatTokenExpiry = (
  expiresAt: string | null | undefined
): string => {
  const date = safeDate(expiresAt);
  if (!date) return 'غير محدد';
  return date.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format a token expiry date in short Arabic (for compact card display).
 */
export const formatTokenExpiryShort = (
  expiresAt: string | null | undefined
): string => {
  const date = safeDate(expiresAt);
  if (!date) return 'غير محدد';
  return date.toLocaleDateString('ar-EG', {
    year: '2-digit',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Human-readable remaining time until expiry.
 * Returns "غير محدد" for null / undefined / invalid dates.
 * Returns "منتهي" when the date is in the past.
 */
export const getTokenTimeRemaining = (
  expiresAt: string | null | undefined
): string => {
  const date = safeDate(expiresAt);
  if (!date) return 'غير محدد';

  const now = Date.now();
  const exp = date.getTime();
  const diffSec = Math.max(0, Math.floor((exp - now) / 1000));

  if (diffSec <= 0) return 'منتهي';

  const h = Math.floor(diffSec / 3600);
  const m = Math.floor((diffSec % 3600) / 60);

  if (h > 0) return `${h} ساعة ${m} دقيقة`;
  return `${m} دقيقة`;
};

/**
 * Format a generic date in Arabic (used for access logs).
 * Returns "غير محدد" for invalid dates.
 */
export const formatTokenDateTime = (
  value: string | null | undefined
): string => {
  const date = safeDate(value);
  if (!date) return 'غير محدد';
  return date.toLocaleString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// ============================================
// ADMIN — EXPIRY OPTIONS (6/24/48 only)
// ============================================

export const VIDEO_TOKEN_EXPIRES_OPTIONS = [
  { value: 6, label: '6 ساعات' },
  { value: 24, label: '24 ساعة (يوم)' },
  { value: 48, label: '48 ساعة (يومان)' },
] as const;

// ============================================
// ADMIN — Token Type Labels
// ============================================

export const VIDEO_TOKEN_TYPE_LABELS: Record<string, string> = {
  donor_inquiry: 'استفسار متبرع',
  admin_custom: 'رابط إداري',
};

export const getVideoTokenTypeLabel = (type: string | null | undefined): string => {
  if (!type) return '—';
  return VIDEO_TOKEN_TYPE_LABELS[type] ?? type;
};