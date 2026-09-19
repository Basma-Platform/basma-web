import type { AdminFeaturedStats } from '../types';

// ============================================
// STATUS
// ============================================

/**
 * Get status color for featured request
 */
export const getFeaturedStatusColor = (
  status: 'pending' | 'approved' | 'rejected'
): string => {
  const map = {
    pending: '#FFC107',
    approved: '#28A745',
    rejected: '#DC3545',
  };
  return map[status];
};

/**
 * Get status tint (light background)
 */
export const getFeaturedStatusBg = (
  status: 'pending' | 'approved' | 'rejected'
): string => `${getFeaturedStatusColor(status)}15`;

/**
 * Get status gradient (for cards + banners)
 */
export const getFeaturedStatusGradient = (
  status: 'pending' | 'approved' | 'rejected'
): string => {
  const map = {
    pending: 'linear-gradient(135deg, #FFC107, #FFD966)',
    approved: 'linear-gradient(135deg, #28A745, #4FCB6E)',
    rejected: 'linear-gradient(135deg, #DC3545, #F56575)',
  };
  return map[status];
};

/**
 * Get status label in Arabic
 */
export const getFeaturedStatusLabel = (
  status: 'pending' | 'approved' | 'rejected'
): string => {
  const map = {
    pending: 'قيد المراجعة',
    approved: 'تمت الموافقة',
    rejected: 'مرفوض',
  };
  return map[status];
};

// ============================================
// PRICE & DURATION
// ============================================

/**
 * Format price with currency (simple)
 */
export const formatPrice = (
  price: number,
  currency: string = 'ILS'
): string => {
  return `${price.toFixed(2)} ${currency}`;
};

/**
 * Format price with currency symbol
 */
export const formatFeaturedPrice = (
  amount: number | null | undefined,
  currency: string = 'ILS'
): string => {
  if (amount == null) return '—';
  const symbol = currency === 'ILS' ? '₪' : currency;
  return `${amount.toFixed(2)} ${symbol}`;
};

/**
 * Format any number with thousand separators
 */
export const formatFeaturedNumber = (
  value: number | null | undefined
): string => {
  if (value == null) return '0';
  return value.toLocaleString('en-US');
};

/**
 * Get duration label from days
 */
export const getDurationLabel = (days: number): string => {
  if (days === 1) return 'يوم واحد';
  if (days === 2) return 'يومان';
  if (days <= 10) return `${days} أيام`;
  return `${days} يوماً`;
};

// ============================================
// PAYMENT METHOD
// ============================================

/**
 * Get payment method label
 */
export const getPaymentMethodLabel = (
  method: 'palpay' | 'jawwal_pay' | 'bop'
): string => {
  const map = {
    palpay: 'PalPay',
    jawwal_pay: 'Jawwal Pay',
    bop: 'Bank of Palestine',
  };
  return map[method];
};

/**
 * Get payment method color
 */
export const getPaymentMethodColor = (
  method: 'palpay' | 'jawwal_pay' | 'bop'
): string => {
  const map = {
    palpay: '#E87A20',
    jawwal_pay: '#28A745',
    bop: '#17A2B8',
  };
  return map[method] || '#E87A20';
};

// ============================================
// DATES & TIME
// ============================================

/**
 * Format relative time in Arabic ("منذ 3 أيام")
 */
export const formatFeaturedTimeAgo = (date: string): string => {
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
 * Format a date in Arabic
 */
export const formatFeaturedDate = (date: string | null): string => {
  if (!date) return 'غير محدد';
  return new Date(date).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// ============================================
// MISC
// ============================================

/**
 * Get initials from name (Arabic + English friendly)
 */
export const getInitials = (name: string): string => {
  if (!name || !name.trim()) return 'U';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Resolve storage URL for a file path
 */
export const resolveStorageUrl = (path: string | null): string | null => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `http://localhost:8000/storage/${path}`;
};

/**
 * Featured benefits list (used in CTA cards)
 */
export const getFeaturedBenefits = (): string[] => [
  'ظهور في أعلى نتائج البحث',
  'شارة مميز ذهبية',
  'مشاهدات أكثر بـ 10 أضعاف',
  'زيادة فرص التواصل والبيع',
];

/**
 * Expected contact time
 */
export const getExpectedContactTime = (): string => 'خلال 24 ساعة';

/**
 * Working hours
 */
export const getWorkingHours = (): string =>
  'من السبت إلى الخميس، 8:00 ص - 10:00 م';

/**
 * Check if a featured request can be resubmitted
 */
export const canResubmitFeatured = (
  status: 'pending' | 'approved' | 'rejected' | null
): boolean => status === null || status === 'rejected';

/**
 * Get rejection reason display text
 */
export const getRejectionReason = (admin_notes: string | null): string =>
  admin_notes || 'لم يتم تحديد السبب';

// ============================================
// ADMIN — Constants
// ============================================

/**
 * Sort options for admin featured list
 */
export const FEATURED_SORT_OPTIONS = [
  { value: 'newest', label: 'الأحدث أولاً' },
  { value: 'oldest', label: 'الأقدم أولاً' },
  { value: 'amount_high', label: 'الأعلى مبلغاً' },
  { value: 'amount_low', label: 'الأدنى مبلغاً' },
] as const;

/**
 * Payment method filter options
 */
export const FEATURED_PAYMENT_OPTIONS = [
  { value: 'all', label: 'الكل' },
  { value: 'palpay', label: 'PalPay' },
  { value: 'jawwal_pay', label: 'Jawwal Pay' },
  { value: 'bop', label: 'Bank of Palestine' },
] as const;

/**
 * Per page options (multiples of 12 for a 3-col grid)
 */
export const FEATURED_PER_PAGE_OPTIONS = [12, 24, 48, 96] as const;

/**
 * Default per page
 */
export const FEATURED_DEFAULT_PER_PAGE = 12;

/**
 * Pending count for sidebar badge
 */
export const getPendingBadgeCount = (
  stats: AdminFeaturedStats | null
): number | undefined => {
  if (!stats) return undefined;
  const count = stats.requests.pending;
  return count > 0 ? count : undefined;
};