import { getStorageUrl } from './storageHelpers';

// ============================================
// Date helpers
// ============================================

/**
 * Format date to Arabic
 */
export const formatProfileDate = (date: string | null): string => {
  if (!date) return 'غير محدد';
  return new Date(date).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// ============================================
// Verification helpers
// ============================================

/**
 * Get verification status label in Arabic
 */
export const getVerificationStatusLabel = (
  status: 'pending' | 'approved' | 'rejected' | null
): string => {
  const map: Record<string, string> = {
    pending: 'قيد المراجعة',
    approved: 'موثق',
    rejected: 'مرفوض',
  };
  return status ? map[status] || status : 'غير موثق';
};

/**
 * Get verification status color
 */
export const getVerificationStatusColor = (
  status: 'pending' | 'approved' | 'rejected' | null
): string => {
  const map: Record<string, string> = {
    pending: '#FFC107',
    approved: '#28A745',
    rejected: '#DC3545',
  };
  return status ? map[status] || 'var(--text-muted)' : 'var(--text-muted)';
};

// ============================================
// Monthly limit helpers
// ============================================

/**
 * Check if monthly limit is unlimited
 */
export const isUnlimited = (limit: number): boolean => {
  return limit <= 0;
};

/**
 * Get monthly usage percentage
 */
export const getMonthlyUsagePercentage = (
  used: number,
  limit: number
): number => {
  if (isUnlimited(limit)) return 0;
  return Math.min((used / limit) * 100, 100);
};

/**
 * Get monthly usage color based on percentage
 */
export const getMonthlyUsageColor = (percentage: number): string => {
  if (percentage >= 100) return '#DC3545';
  if (percentage >= 80) return '#FFC107';
  return '#28A745';
};

// ============================================
// User helpers
// ============================================

/**
 * Get user initials from name
 */
export const getUserInitials = (name: string): string => {
  if (!name) return 'U';
  const names = name.trim().split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

/**
 * Get profile image URL
 * Uses the environment-aware storage helper
 */
export const getProfileImageUrl = (
  imagePath: string | null
): string | null => {
  if (!imagePath) return null;
  return getStorageUrl(imagePath);
};

// ============================================
// File validation
// ============================================

/**
 * Validate image file
 */
export const validateImageFile = (
  file: File
): { valid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const maxSize = 2 * 1024 * 1024; // 2MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'الصورة يجب أن تكون بصيغة JPG أو PNG' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'حجم الصورة يجب أن لا يتجاوز 2 ميجابايت' };
  }

  return { valid: true };
};