import type { HelpRequestStatus, HelpRequestDisplayNameType } from '../types';

// ============================================
// BASMA FUND THEME — Teal
// ============================================

export const FUND_THEME = {
  accent: '#17A2B8',
  accentDark: '#138496',
  accentLight: '#20C9E0',
  accentSoft: 'rgba(23, 162, 184, 0.10)',
  accentSoftDark: 'rgba(23, 162, 184, 0.18)',
  gradient: 'linear-gradient(135deg, #17A2B8, #20C9E0)',
  gradientDeep: 'linear-gradient(135deg, #138496, #17A2B8)',
  shadow: 'rgba(23, 162, 184, 0.35)',
} as const;

// ============================================
// STATUS helpers
// ============================================

export const getHelpRequestStatusLabel = (
  status: HelpRequestStatus
): string => {
  const map: Record<HelpRequestStatus, string> = {
    pending: 'قيد المراجعة',
    approved: 'منشور',
    rejected: 'مرفوض',
    archived: 'مؤرشف',
  };
  return map[status];
};

export const getHelpRequestStatusColor = (
  status: HelpRequestStatus
): string => {
  const map: Record<HelpRequestStatus, string> = {
    pending: '#FFC107',
    approved: '#28A745',
    rejected: '#DC3545',
    archived: '#6B4226',
  };
  return map[status];
};

export const getHelpRequestStatusBg = (
  status: HelpRequestStatus
): string => `${getHelpRequestStatusColor(status)}15`;

export const getHelpRequestStatusGradient = (
  status: HelpRequestStatus
): string => {
  const map: Record<HelpRequestStatus, string> = {
    pending: 'linear-gradient(90deg, #FFC107, #F5A623)',
    approved: 'linear-gradient(90deg, #28A745, #4FCB6E)',
    rejected: 'linear-gradient(90deg, #DC3545, #F56575)',
    archived: 'linear-gradient(90deg, #6B4226, #8B5A2B)',
  };
  return map[status];
};

// ============================================
// DISPLAY NAME helpers
// ============================================

export const getDisplayNameLabel = (
  type: HelpRequestDisplayNameType
): string => {
  const map: Record<HelpRequestDisplayNameType, string> = {
    full: 'الاسم الكامل',
    anonymous: 'مجهول',
    custom: 'اسم مخصص',
  };
  return map[type];
};

// ============================================
// VIDEO helpers
// ============================================

export const formatVideoDuration = (seconds: number | null): string => {
  if (!seconds) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};

export const formatFileSize = (bytes: number | null): string => {
  if (!bytes) return '—';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

// ============================================
// DELETE WINDOW helpers
// ============================================

/**
 * Format seconds remaining as "29:45" or "0:30"
 */
export const formatDeleteCountdown = (seconds: number): string => {
  if (seconds <= 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};

/**
 * Check if delete window is still open
 */
export const isDeleteWindowOpen = (
  deleteSecondsRemaining: number | null
): boolean => {
  return (deleteSecondsRemaining ?? 0) > 0;
};

// ============================================
// DATE helpers
// ============================================

export const formatHelpRequestDate = (date: string | null): string => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatHelpRequestTimeAgo = (date: string): string => {
  const now = new Date();
  const then = new Date(date);
  const diffSec = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffSec < 60) return 'الآن';
  if (diffSec < 3600) {
    const m = Math.floor(diffSec / 60);
    return m === 1 ? 'منذ دقيقة' : `منذ ${m} دقيقة`;
  }
  if (diffSec < 86400) {
    const h = Math.floor(diffSec / 3600);
    return h === 1 ? 'منذ ساعة' : `منذ ${h} ساعات`;
  }
  if (diffSec < 604800) {
    const d = Math.floor(diffSec / 86400);
    return d === 1 ? 'منذ يوم' : `منذ ${d} أيام`;
  }
  if (diffSec < 2592000) {
    const w = Math.floor(diffSec / 604800);
    return w === 1 ? 'منذ أسبوع' : `منذ ${w} أسابيع`;
  }
  const mo = Math.floor(diffSec / 2592000);
  return mo === 1 ? 'منذ شهر' : `منذ ${mo} أشهر`;
};

// ============================================
// VIDEO FILE validation (client-side, before upload)
// ============================================

export const validateHelpRequestVideo = (
  file: File,
  rules?: {
    formats?: string[];
    min_duration_sec?: number;
    max_duration_sec?: number;
    max_size_mb?: number;
  }
): { valid: boolean; error?: string } => {
  const formats = rules?.formats ?? ['MP4'];
  const maxSizeMB = rules?.max_size_mb ?? 100;
  const minDur = rules?.min_duration_sec ?? 60;
  const maxDur = rules?.max_duration_sec ?? 90;

  // Format check (MIME + extension)
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  const isMp4 = file.type === 'video/mp4' || ext === 'mp4';
  if (!isMp4) {
    return { valid: false, error: `الفيديو يجب أن يكون بصيغة ${formats.join(', ')}` };
  }

  // Size check
  const sizeMB = file.size / 1024 / 1024;
  if (sizeMB > maxSizeMB) {
    return {
      valid: false,
      error: `حجم الفيديو يجب ألا يتجاوز ${maxSizeMB} ميجابايت`,
    };
  }

  // Duration check will happen on metadata load (in uploader component)
  // Return placeholder; component re-validates after video metadata loads
  void minDur;
  void maxDur;

  return { valid: true };
};

/**
 * Validate video duration — call after metadata loads in uploader
 */
export const validateVideoDuration = (
  durationSec: number,
  rules?: { min_duration_sec?: number; max_duration_sec?: number }
): { valid: boolean; error?: string } => {
  const minDur = rules?.min_duration_sec ?? 60;
  const maxDur = rules?.max_duration_sec ?? 90;

  if (durationSec < minDur) {
    return {
      valid: false,
      error: `مدة الفيديو يجب أن تكون ${minDur} ثانية على الأقل`,
    };
  }
  if (durationSec > maxDur) {
    return {
      valid: false,
      error: `مدة الفيديو يجب ألا تتجاوز ${maxDur} ثانية`,
    };
  }
  return { valid: true };
};

// ============================================
// PLACEHOLDER image (blurred thumbnails)
// ============================================

export const HELP_REQUEST_VIDEO_PLACEHOLDER =
  '/placeholder-video-thumb.png';

// ============================================
// ERROR CODE mapper (backend → Arabic)
// ============================================

export const getHelpRequestErrorLabel = (
  errorCode: string | undefined
): string => {
  const map: Record<string, string> = {
    verification_required: 'يجب توثيق هويتك أولاً لتقديم طلب',
    max_active_requests_reached: 'وصلت إلى الحد الأقصى من الطلبات النشطة',
    max_monthly_requests_reached: 'وصلت إلى الحد الشهري لعدد الطلبات',
    duplicate_video: 'هذا الفيديو مستخدم مسبقاً في طلب آخر',
    invalid_video_duration: 'مدة الفيديو غير مطابقة للمطلوب',
    delete_window_expired: 'انتهت مدة الحذف المتاحة (30 دقيقة)',
    cannot_delete_after_review: 'لا يمكن الحذف بعد بدء المراجعة',
    help_request_not_found: 'الطلب غير موجود',
    help_request_store_failed: 'حدث خطأ أثناء رفع الطلب',
    delete_failed: 'حدث خطأ أثناء الحذف',
    processing_failed: 'حدث خطأ أثناء المعالجة',
    already_processed: 'تمت معالجة الطلب مسبقاً',
    only_approved_can_be_archived: 'فقط الطلبات المنشورة يمكن أرشفتها',
  };
  return errorCode ? map[errorCode] ?? 'حدث خطأ غير متوقع' : 'حدث خطأ غير متوقع';
};