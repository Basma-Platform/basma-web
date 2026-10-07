import type {
  DonationInquiryStatus,
  DonationContactMethod,
} from '../types';

// ============================================
// INQUIRY STATUS
// ============================================

export const getInquiryStatusLabel = (
  status: DonationInquiryStatus
): string => {
  const map: Record<DonationInquiryStatus, string> = {
    new: 'جديد',
    contacted: 'تم التواصل',
    completed: 'مكتمل',
    cancelled: 'ملغي',
  };
  return map[status];
};

export const getInquiryStatusColor = (
  status: DonationInquiryStatus
): string => {
  const map: Record<DonationInquiryStatus, string> = {
    new: '#17A2B8',
    contacted: '#FFC107',
    completed: '#28A745',
    cancelled: '#6C757D',
  };
  return map[status];
};

export const getInquiryStatusBg = (status: DonationInquiryStatus): string =>
  `${getInquiryStatusColor(status)}15`;

export const getInquiryStatusGradient = (
  status: DonationInquiryStatus
): string => {
  const map: Record<DonationInquiryStatus, string> = {
    new: 'linear-gradient(90deg, #17A2B8, #20C9E0)',
    contacted: 'linear-gradient(90deg, #FFC107, #F5A623)',
    completed: 'linear-gradient(90deg, #28A745, #4FCB6E)',
    cancelled: 'linear-gradient(90deg, #6C757D, #9CA3AF)',
  };
  return map[status];
};

// ============================================
// CONTACT METHOD
// ============================================

export const getContactMethodLabel = (
  method: DonationContactMethod
): string => {
  const map: Record<DonationContactMethod, string> = {
    whatsapp: 'واتساب',
    email: 'بريد إلكتروني',
    platform: 'عبر المنصة',
  };
  return map[method];
};

export const getContactMethodColor = (
  method: DonationContactMethod
): string => {
  const map: Record<DonationContactMethod, string> = {
    whatsapp: '#25D366',
    email: '#17A2B8',
    platform: '#E87A20',
  };
  return map[method];
};

// ============================================
// DATE
// ============================================

/**
 * Format any ISO date string to Arabic long date.
 * Safe — returns "غير محدد" if null.
 */
export const formatInquiryDate = (date: string | null): string => {
  if (!date) return 'غير محدد';
  return new Date(date).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format ISO date to Arabic date + time.
 */
export const formatInquiryDateTime = (date: string | null): string => {
  if (!date) return 'غير محدد';
  return new Date(date).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Relative Arabic time ("منذ 3 أيام").
 */
export const formatInquiryTimeAgo = (date: string): string => {
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
// TRACKING CODE
// ============================================

/**
 * Validate tracking code format: DON-XXXXXX
 */
export const isValidTrackingCode = (code: string): boolean => {
  return /^DON-[A-Z0-9]{6}$/i.test(code.trim());
};

/**
 * Normalize tracking code input (uppercase, trim).
 */
export const normalizeTrackingCode = (code: string): string => {
  return code.trim().toUpperCase();
};

// ============================================
// PLATFORM CONTACT
// ============================================

export interface PlatformContact {
  whatsapp: string;
  email: string;
  phone?: string;
  working_hours: string;
}

export const buildWhatsAppLink = (
  phone: string,
  message?: string
): string => {
  const clean = phone.replace(/[^\d]/g, '');
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${clean}${text}`;
};

export const buildMailtoLink = (
  email: string,
  subject?: string,
  body?: string
): string => {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  const qs = params.toString();
  return `mailto:${email}${qs ? `?${qs}` : ''}`;
};

// ============================================
// ERROR mapper
// ============================================

export const getInquiryErrorLabel = (
  errorCode: string | undefined
): string => {
  const map: Record<string, string> = {
    help_request_not_found: 'الطلب غير موجود',
    inquiry_already_exists: 'لديك استفسار سابق حول هذا الطلب خلال 24 ساعة',
    tracking_code_not_found: 'كود التتبع غير صحيح',
    inquiry_not_found: 'الاستفسار غير موجود',
  };
  return errorCode ? map[errorCode] ?? 'حدث خطأ غير متوقع' : 'حدث خطأ غير متوقع';
};