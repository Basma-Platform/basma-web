import type { VerificationStatus } from '../types';

/**
 * Get status label in Arabic
 */
export const getVerificationStatusLabel = (
  status: VerificationStatus | null
): string => {
  if (!status) return 'لم يبدأ';
  const map: Record<VerificationStatus, string> = {
    pending: 'قيد المراجعة',
    approved: 'موثق',
    rejected: 'مرفوض',
  };
  return map[status];
};

/**
 * Get status color
 */
export const getVerificationStatusColor = (
  status: VerificationStatus | null
): string => {
  if (!status) return 'var(--text-muted)';
  const map: Record<VerificationStatus, string> = {
    pending: '#FFC107',
    approved: '#28A745',
    rejected: '#DC3545',
  };
  return map[status];
};

/**
 * Get status background (light tint)
 */
export const getVerificationStatusBg = (
  status: VerificationStatus | null
): string => {
  const color = getVerificationStatusColor(status);
  return `${color}15`;
};

/**
 * Format date for verification display
 */
export const formatVerificationDate = (date: string | null): string => {
  if (!date) return 'غير محدد';
  return new Date(date).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Get file type label based on mime type
 */
export const getFileTypeLabel = (mimeType: string): string => {
  if (mimeType === 'application/pdf') return 'PDF';
  if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') return 'JPG';
  if (mimeType === 'image/png') return 'PNG';
  return 'ملف';
};