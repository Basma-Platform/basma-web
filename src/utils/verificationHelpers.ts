import type { VerificationStatus, DocumentType } from '../types';

// ============================================
// STATUS HELPERS
// ============================================

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

// ============================================
// DATE HELPERS
// ============================================

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
 * Get relative time for access log
 */
export const formatAccessTime = (accessedAt: string): string => {
  const now = Date.now();
  const time = new Date(accessedAt).getTime();
  const diff = Math.floor((now - time) / 1000);

  if (diff < 60) return 'الآن';
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
  if (diff < 604800) return `منذ ${Math.floor(diff / 86400)} يوم`;
  return new Date(accessedAt).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Calculate remaining days until auto-delete
 */
export const getDaysUntilAutoDelete = (
  autoDeleteAt: string | null
): number | null => {
  if (!autoDeleteAt) return null;
  const diff = new Date(autoDeleteAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

/**
 * Format auto-delete date for display
 */
export const formatAutoDeleteDate = (autoDeleteAt: string | null): string => {
  if (!autoDeleteAt) return 'غير محدد';
  return new Date(autoDeleteAt).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// ============================================
// FILE HELPERS
// ============================================

/**
 * Get file type label based on mime type
 */
export const getFileTypeLabel = (mimeType: string): string => {
  if (mimeType === 'application/pdf') return 'PDF';
  if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') return 'JPG';
  if (mimeType === 'image/png') return 'PNG';
  return 'ملف';
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

// ============================================
// DOCUMENT TYPE HELPERS
// ============================================

/**
 * Get Arabic label for document type
 */
export const getDocumentTypeLabel = (type: DocumentType | null): string => {
  if (!type) return 'غير محدد';
  const map: Record<DocumentType, string> = {
    national_id: 'هوية وطنية',
    passport: 'جواز سفر',
    driver_license: 'رخصة قيادة',
    university_card: 'بطاقة جامعية',
    other: 'أخرى',
  };
  return map[type];
};

/**
 * Get color for document type badge
 */
export const getDocumentTypeColor = (type: DocumentType | null): string => {
  if (!type) return 'var(--text-muted)';
  const map: Record<DocumentType, string> = {
    national_id: '#E87A20',
    passport: '#17A2B8',
    driver_license: '#28A745',
    university_card: '#9C27B0',
    other: '#8B5A2B',
  };
  return map[type];
};

/**
 * Get icon name for document type (for react-icons mapping)
 */
export const getDocumentTypeIconName = (type: DocumentType | null): string => {
  if (!type) return 'file';
  const map: Record<DocumentType, string> = {
    national_id: 'id-card',
    passport: 'passport',
    driver_license: 'car',
    university_card: 'graduation-cap',
    other: 'file',
  };
  return map[type];
};

// ============================================
// IMAGE AVAILABILITY HELPERS
// ============================================

/**
 * Check if image is still available (not deleted)
 */
export const isImageAvailable = (
  hasImage: boolean,
  imageDeletedAt: string | null
): boolean => {
  return hasImage && !imageDeletedAt;
};

/**
 * Get deletion status label
 */
export const getImageDeletionStatusLabel = (
  imageDeletedAt: string | null,
  autoDeleteAt: string | null
): string => {
  if (imageDeletedAt) return 'تم حذف الصورة';
  if (autoDeleteAt) return 'سيتم الحذف تلقائياً';
  return 'الصورة متوفرة';
};

/**
 * Get deletion status color
 */
export const getImageDeletionStatusColor = (
  imageDeletedAt: string | null
): string => {
  if (imageDeletedAt) return '#6C757D';
  return '#28A745';
};

// ============================================
// CAN-UPLOAD HELPERS
// ============================================

/**
 * Determine if user can upload (based on status response)
 */
export const canUserUpload = (
  status: VerificationStatus | null,
  isVerified: boolean
): boolean => {
  if (isVerified) return false;
  if (status === null) return true;
  if (status === 'rejected') return true;
  return false;
};

/**
 * Get action label for the current state
 */
export const getActionLabel = (
  status: VerificationStatus | null,
  isVerified: boolean
): string => {
  if (isVerified) return 'موثق';
  if (status === null) return 'ابدأ التوثيق';
  if (status === 'pending') return 'قيد المراجعة';
  if (status === 'rejected') return 'إعادة رفع الطلب';
  return 'ابدأ التوثيق';
};