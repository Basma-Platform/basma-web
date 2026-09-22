import type {
  ReportStatus,
  ReportPriority,
  ReportTargetType,
  ReportAction,
  ReportActionTaken,
  AdminReportsStats,
} from '../types';

// ============================================
// STATUS
// ============================================

/**
 * Get Arabic label for report status
 */
export const getReportStatusLabel = (status: ReportStatus): string => {
  const map: Record<ReportStatus, string> = {
    pending: 'قيد المراجعة',
    reviewed: 'تمت المعالجة',
    rejected: 'مرفوض',
  };
  return map[status];
};

/**
 * Get color for report status
 */
export const getReportStatusColor = (status: ReportStatus): string => {
  const map: Record<ReportStatus, string> = {
    pending: '#FFC107',
    reviewed: '#28A745',
    rejected: '#6C757D',
  };
  return map[status];
};

/**
 * Get light background tint for report status
 */
export const getReportStatusBg = (status: ReportStatus): string => {
  return `${getReportStatusColor(status)}15`;
};

/**
 * Get gradient for report status
 */
export const getReportStatusGradient = (status: ReportStatus): string => {
  const map: Record<ReportStatus, string> = {
    pending: 'linear-gradient(135deg, #FFC107, #FFD966)',
    reviewed: 'linear-gradient(135deg, #28A745, #4FCB6E)',
    rejected: 'linear-gradient(135deg, #6C757D, #9CA3AF)',
  };
  return map[status];
};

// ============================================
// PRIORITY
// ============================================

/**
 * Get Arabic label for priority
 */
export const getReportPriorityLabel = (
  priority: ReportPriority
): string => {
  const map: Record<ReportPriority, string> = {
    low: 'منخفضة',
    medium: 'متوسطة',
    high: 'عالية',
  };
  return map[priority];
};

/**
 * Get color for priority
 */
export const getReportPriorityColor = (
  priority: ReportPriority
): string => {
  const map: Record<ReportPriority, string> = {
    low: '#17A2B8',
    medium: '#FFC107',
    high: '#DC3545',
  };
  return map[priority];
};

/**
 * Get light background tint for priority
 */
export const getReportPriorityBg = (
  priority: ReportPriority
): string => {
  return `${getReportPriorityColor(priority)}15`;
};

// ============================================
// TARGET TYPE
// ============================================

/**
 * Get Arabic label for target type
 */
export const getTargetTypeLabel = (
  targetType: ReportTargetType
): string => {
  const map: Record<ReportTargetType, string> = {
    user: 'مستخدم',
    announcement: 'إعلان',
  };
  return map[targetType];
};

/**
 * Get color for target type
 */
export const getTargetTypeColor = (
  targetType: ReportTargetType
): string => {
  const map: Record<ReportTargetType, string> = {
    user: '#E87A20',
    announcement: '#17A2B8',
  };
  return map[targetType];
};

// ============================================
// ACTIONS
// ============================================

/**
 * Get Arabic label for admin action
 */
export const getActionLabel = (action: ReportAction | ReportActionTaken | null): string => {
  if (!action) return '';

  const map: Record<string, string> = {
    // Request actions
    warn_user: 'تحذير المستخدم',
    suspend_user: 'تعليق الحساب',
    block_user: 'حظر الحساب',
    delete_content: 'حذف المحتوى',
    reject_report: 'رفض البلاغ',
    // Taken (stored) actions
    warned: 'تحذير',
    suspended: 'تعليق',
    blocked: 'حظر',
    deleted_content: 'حذف المحتوى',
    rejected: 'رفض البلاغ',
  };
  return map[action] || action;
};

/**
 * Get color for action
 */
export const getActionColor = (
  action: ReportAction | ReportActionTaken
): string => {
  const map: Record<string, string> = {
    // Request actions
    warn_user: '#FFC107',
    suspend_user: '#FF9800',
    block_user: '#DC3545',
    delete_content: '#DC3545',
    reject_report: '#6C757D',
    // Taken actions
    warned: '#FFC107',
    suspended: '#FF9800',
    blocked: '#DC3545',
    deleted_content: '#DC3545',
    rejected: '#6C757D',
  };
  return map[action] || '#6C757D';
};

/**
 * Check if action requires suspend_days input
 */
export const actionRequiresSuspendDays = (
  action: ReportAction
): boolean => {
  return action === 'suspend_user';
};

/**
 * Check if action affects the reported user (vs just rejecting the report)
 */
export const actionAffectsUser = (action: ReportAction): boolean => {
  return action !== 'reject_report';
};

// ============================================
// DATES
// ============================================

/**
 * Format relative time in Arabic
 */
export const formatReportTimeAgo = (date: string): string => {
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

/**
 * Format a date in Arabic (long)
 */
export const formatReportDate = (date: string | null): string => {
  if (!date) return 'غير محدد';
  return new Date(date).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// ============================================
// STATS
// ============================================

/**
 * Get pending count for sidebar badge
 */
export const getPendingBadgeCount = (
  stats: AdminReportsStats | null
): number | undefined => {
  if (!stats) return undefined;
  const count = stats.reports.pending;
  return count > 0 ? count : undefined;
};

// ============================================
// CONSTANTS
// ============================================

/**
 * Sort options for admin reports list
 */
export const REPORT_SORT_OPTIONS = [
  { value: 'newest', label: 'الأحدث أولاً' },
  { value: 'oldest', label: 'الأقدم أولاً' },
  { value: 'priority', label: 'الأولوية' },
] as const;

/**
 * Priority filter options
 */
export const REPORT_PRIORITY_OPTIONS = [
  { value: 'all', label: 'الكل' },
  { value: 'high', label: 'عالية' },
  { value: 'medium', label: 'متوسطة' },
  { value: 'low', label: 'منخفضة' },
] as const;

/**
 * Target type filter options
 */
export const REPORT_TARGET_TYPE_OPTIONS = [
  { value: 'all', label: 'الكل' },
  { value: 'user', label: 'مستخدم' },
  { value: 'announcement', label: 'إعلان' },
] as const;

/**
 * Status filter options
 */
export const REPORT_STATUS_OPTIONS = [
  { value: 'all', label: 'الكل' },
  { value: 'pending', label: 'قيد المراجعة' },
  { value: 'reviewed', label: 'تمت المعالجة' },
  { value: 'rejected', label: 'مرفوض' },
] as const;

/**
 * Per page options (multiples of 12 for a 3-col grid)
 */
export const REPORT_PER_PAGE_OPTIONS = [12, 24, 48, 96] as const;

/**
 * Default per page
 */
export const REPORT_DEFAULT_PER_PAGE = 12;

/**
 * Format any number with thousand separators
 */
export const formatReportNumber = (
  value: number | null | undefined
): string => {
  if (value == null) return '0';
  return value.toLocaleString('en-US');
};