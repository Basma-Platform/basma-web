import type {
  UserAnnouncementDetailResponse,
  Announcement,
} from '../types';

/**
 * Get Arabic label for announcement status
 */
export const getAnnouncementStatusLabel = (
  status: 'active' | 'disabled' | 'deleted'
): string => {
  const map = {
    active: 'نشط',
    disabled: 'معطل',
    deleted: 'محذوف',
  };
  return map[status];
};

/**
 * Get color for announcement status
 */
export const getAnnouncementStatusColor = (
  status: 'active' | 'disabled' | 'deleted'
): string => {
  const map = {
    active: '#28A745',
    disabled: '#FFC107',
    deleted: '#DC3545',
  };
  return map[status];
};

/**
 * Get icon for announcement status
 */
export const getAnnouncementStatusIcon = (
  status: 'active' | 'disabled' | 'deleted'
): string => {
  const map = {
    active: '✅',
    disabled: '⏸️',
    deleted: '🗑️',
  };
  return map[status];
};

/**
 * Check which actions are available for a user announcement
 */
export const getAvailableActions = (
  announcement: UserAnnouncementDetailResponse
) => {
  return {
    canEdit: announcement.can_edit,
    canDelete: announcement.can_delete,
    canDisable: announcement.can_disable,
    canEnable: announcement.can_reenable,
    canFeature: announcement.can_feature,
  };
};

/**
 * Format date in Arabic (long format)
 */
export const formatAnnouncementDate = (date: string): string => {
  return new Date(date).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format date in Arabic (short format)
 */
export const formatAnnouncementDateShort = (date: string): string => {
  return new Date(date).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Get category label in Arabic
 */
export const getCategoryLabel = (category: 'goods' | 'services'): string => {
  return category === 'goods' ? 'سلع' : 'خدمات';
};

/**
 * Get type label in Arabic
 */
export const getTypeLabel = (type: 'offer' | 'request'): string => {
  return type === 'offer' ? 'عرض' : 'طلب';
};

/**
 * Get price label in Arabic
 */
export const getPriceLabel = (
  price_type: 'free' | 'paid' | 'barter',
  price?: number | null
): string => {
  switch (price_type) {
    case 'free':
      return 'مجاني';
    case 'paid':
      return price ? `${price} شيكل` : 'مدفوع';
    case 'barter':
      return 'مقايضة';
    default:
      return '';
  }
};

/**
 * Get privacy label in Arabic
 */
export const getPrivacyLabel = (
  privacy: 'public' | 'verified_only' | 'region_only' | 'verified_region'
): string => {
  const map = {
    public: 'عام',
    region_only: 'للمنطقة فقط',
    verified_only: 'للموثقين فقط',
    verified_region: 'للموثقين والمنطقة',
  };
  return map[privacy];
};

/**
 * Get privacy color
 */
export const getPrivacyColor = (
  privacy: 'public' | 'verified_only' | 'region_only' | 'verified_region'
): string => {
  const map = {
    public: '#28A745',
    region_only: '#17A2B8',
    verified_only: '#E87A20',
    verified_region: '#FFC107',
  };
  return map[privacy];
};

/**
 * Get featured badge label
 */
export const getFeaturedBadgeLabel = (
  isFeatured: boolean,
  requestStatus: 'pending' | 'approved' | 'rejected' | null
): string | null => {
  if (isFeatured) return 'مميز ⭐';
  if (requestStatus === 'pending') return 'قيد المراجعة';
  return null;
};

/**
 * Get featured badge color
 */
export const getFeaturedBadgeColor = (
  isFeatured: boolean,
  requestStatus: 'pending' | 'approved' | 'rejected' | null
): string | null => {
  if (isFeatured) return '#FFC107';
  if (requestStatus === 'pending') return '#E87A20';
  return null;
};

/**
 * Get cover image URL from images array
 */
export const getCoverImageUrl = (announcement: Announcement): string => {
  if (announcement.images && announcement.images.length > 0) {
    const firstImage = announcement.images.sort((a, b) => a.order - b.order)[0];
    return `http://localhost:8000/storage/${firstImage.image_path}`;
  }
  return '/placeholder-image.png';
};

/**
 * Calculate remaining days until permanent deletion
 */
export const getDaysUntilPermanentDeletion = (
  deletionInfo: { days_remaining: number }
): string => {
  const days = deletionInfo.days_remaining;
  if (days <= 0) return 'سيتم الحذف قريباً';
  if (days === 1) return 'يوم واحد متبقٍ';
  if (days <= 10) return `${days} أيام متبقية`;
  return `${days} يوماً متبقياً`;
};

/**
 * Check if announcement can be featured
 */
export const canBeFeatured = (announcement: UserAnnouncementDetailResponse): boolean => {
  return (
    announcement.status === 'active' &&
    !announcement.is_currently_featured &&
    announcement.featured_request_status !== 'pending'
  );
};

/**
 * Check if the current user owns this announcement
 * Used to show the "إعلانك" (Your Announcement) badge
 */
export const isOwnAnnouncement = (
  announcement: { user_id: number } | null | undefined,
  currentUserId: number | null | undefined
): boolean => {
  if (!announcement || !currentUserId) return false;
  return announcement.user_id === currentUserId;
};

/**
 * Get "إعلانك" badge styling (theme-aware)
 */
export const getOwnBadgeStyle = (isDark: boolean) => ({
  backgroundColor: isDark
    ? 'rgba(22, 78, 99, 0.75)'      // dark teal glass
    : 'rgba(23, 162, 184, 0.82)',   // solid-ish teal glass
  color: '#FFFFFF',
  border: isDark
    ? '1px solid rgba(32, 201, 224, 0.55)'
    : '1px solid rgba(255, 255, 255, 0.35)',
  // Frosted glass effect
  backdropFilter: 'blur(12px) saturate(180%)',
  WebkitBackdropFilter: 'blur(12px) saturate(180%)',
  // Soft lift from background
  boxShadow: isDark
    ? '0 4px 14px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
    : '0 4px 14px rgba(23, 162, 184, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
});