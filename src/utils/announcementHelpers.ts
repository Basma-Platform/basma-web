import type {
  UserAnnouncementDetailResponse,
  Announcement,
} from '../types';
import { getStorageUrl } from './storageHelpers';

// ============================================
// Status helpers (✅ added 'completed')
// ============================================

export const getAnnouncementStatusLabel = (
  status: 'active' | 'disabled' | 'completed' | 'deleted'
): string => {
  const map = {
    active: 'نشط',
    disabled: 'معطل',
    completed: 'مكتمل',
    deleted: 'محذوف',
  };
  return map[status];
};

export const getAnnouncementStatusColor = (
  status: 'active' | 'disabled' | 'completed' | 'deleted'
): string => {
  const map = {
    active: '#28A745',
    disabled: '#FFC107',
    completed: '#17A2B8',
    deleted: '#DC3545',
  };
  return map[status];
};

export const getAnnouncementStatusIcon = (
  status: 'active' | 'disabled' | 'completed' | 'deleted'
): string => {
  const map = {
    active: '✅',
    disabled: '⏸️',
    completed: '🏁',
    deleted: '🗑️',
  };
  return map[status];
};

// ============================================
// Available actions (✅ added complete/reopen)
// ============================================

export const getAvailableActions = (
  announcement: UserAnnouncementDetailResponse
) => {
  return {
    canEdit: announcement.can_edit,
    canDelete: announcement.can_delete,
    canDisable: announcement.can_disable,
    canEnable: announcement.can_reenable,
    canFeature: announcement.can_feature,
    canComplete: announcement.can_complete,
    canReopen: announcement.can_reopen,
  };
};

// ============================================
// Date helpers
// ============================================

export const formatAnnouncementDate = (date: string): string => {
  return new Date(date).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatAnnouncementDateShort = (date: string): string => {
  return new Date(date).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// ============================================
// Label helpers
// (getCategoryLabel has been moved to categoryHelpers.ts)
// ============================================

export const getTypeLabel = (type: 'offer' | 'request'): string => {
  return type === 'offer' ? 'عرض' : 'طلب';
};

/**
 * price_type is now 'paid' | 'barter' only.
 * Uses barter_offered/requested for barter label when available.
 */
export const getPriceLabel = (
  price_type: 'paid' | 'barter',
  price?: number | null,
  barter_offered?: string | null,
  barter_requested?: string | null
): string => {
  switch (price_type) {
    case 'paid':
      return price ? `${price} شيكل` : 'مدفوع';
    case 'barter':
      if (barter_offered && barter_requested) {
        return `مقايضة: ${barter_offered} ↔ ${barter_requested}`;
      }
      return 'مقايضة';
    default:
      return '';
  }
};

/**
 * Get a SHORT barter badge label (for cards).
 */
export const getBarterBadgeLabel = (): string => 'مقايضة';

/**
 * Get negotiable badge label.
 */
export const getNegotiableLabel = (): string => 'قابل للتفاوض';

/**
 * Get full barter detail text (for details page).
 */
export const getBarterDetail = (
  barter_offered: string | null | undefined,
  barter_requested: string | null | undefined
): { offered: string; requested: string } | null => {
  if (!barter_offered && !barter_requested) return null;
  return {
    offered: barter_offered || '—',
    requested: barter_requested || '—',
  };
};

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

// ============================================
// Featured helpers
// ============================================

export const getFeaturedBadgeLabel = (
  isFeatured: boolean,
  requestStatus: 'pending' | 'approved' | 'rejected' | null
): string | null => {
  if (isFeatured) return 'مميز ⭐';
  if (requestStatus === 'pending') return 'قيد المراجعة';
  return null;
};

export const getFeaturedBadgeColor = (
  isFeatured: boolean,
  requestStatus: 'pending' | 'approved' | 'rejected' | null
): string | null => {
  if (isFeatured) return '#FFC107';
  if (requestStatus === 'pending') return '#E87A20';
  return null;
};

// ============================================
// Image helpers
// ============================================

export const getCoverImageUrl = (
  announcement: Announcement,
  fallback: string = '/placeholder-image.png'
): string => {
  if (announcement.images && announcement.images.length > 0) {
    const firstImage = [...announcement.images].sort(
      (a, b) => a.order - b.order
    )[0];
    return getStorageUrl(firstImage.image_path, fallback) ?? fallback;
  }
  return fallback;
};

// ============================================
// Misc helpers
// ============================================

export const getDaysUntilPermanentDeletion = (deletionInfo: {
  days_remaining: number;
}): string => {
  const days = deletionInfo.days_remaining;
  if (days <= 0) return 'سيتم الحذف قريباً';
  if (days === 1) return 'يوم واحد متبقٍ';
  if (days <= 10) return `${days} أيام متبقية`;
  return `${days} يوماً متبقياً`;
};

export const canBeFeatured = (
  announcement: UserAnnouncementDetailResponse
): boolean => {
  return (
    announcement.status === 'active' &&
    !announcement.is_currently_featured &&
    announcement.featured_request_status !== 'pending'
  );
};

export const isOwnAnnouncement = (
  announcement: { user_id: number } | null | undefined,
  currentUserId: number | null | undefined
): boolean => {
  if (!announcement || !currentUserId) return false;
  return announcement.user_id === currentUserId;
};

export const getOwnBadgeStyle = (isDark: boolean) => ({
  backgroundColor: isDark
    ? 'rgba(22, 78, 99, 0.75)'
    : 'rgba(23, 162, 184, 0.82)',
  color: '#FFFFFF',
  border: isDark
    ? '1px solid rgba(32, 201, 224, 0.55)'
    : '1px solid rgba(255, 255, 255, 0.35)',
  backdropFilter: 'blur(12px) saturate(180%)',
  WebkitBackdropFilter: 'blur(12px) saturate(180%)',
  boxShadow: isDark
    ? '0 4px 14px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
    : '0 4px 14px rgba(23, 162, 184, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
});

// ============================================
// Re-exports from categoryHelpers + composites
// (used by AnnouncementPost / details / cards)
// ============================================

export { getCategoryColor, getCategoryIcon } from './categoryHelpers';

/**
 * Wrapper for getCategoryLabel that accepts a full Category object
 * OR a plain name string. Returns the category name, or "غير مصنّف"
 * when nothing is available.
 *
 * Components call this with `announcement.category` (a Category | null)
 * so we normalize both shapes here.
 */
export const getCategoryLabel = (
  category: { name: string } | string | null | undefined
): string => {
  if (!category) return 'غير مصنّف';
  if (typeof category === 'string') return category || 'غير مصنّف';
  return category.name || 'غير مصنّف';
};

import type { AnnouncementPriceType } from '../types';

/**
 * Type color — offer = success green, request = error red.
 */
export const getTypeColor = (type: 'offer' | 'request'): string => {
  return type === 'offer' ? '#28A745' : '#DC3545';
};

/**
 * Unified price label — handles both 'paid' and 'barter'.
 * For 'paid' → "N شيكل" (or just "مدفوع" if price is null)
 * For 'barter' → "مقايضة"
 */
export const getPriceOrBarterLabel = (
  price_type: AnnouncementPriceType,
  price?: number | null,
  barter_offered?: string | null,
  barter_requested?: string | null
): string => {
  if (price_type === 'barter') {
    if (barter_offered && barter_requested) {
      return `مقايضة: ${barter_offered} ↔ ${barter_requested}`;
    }
    return 'مقايضة';
  }
  // paid
  return price ? `${price} شيكل` : 'مدفوع';
};

// ============================================
// Status badge style — glassy design (same family as إعلانك)
// ============================================

type StatusBadgeVariant =
  | 'active'
  | 'disabled'
  | 'completed'
  | 'deleted'
  | 'featured'
  | 'pending'
  | 'rejected';

interface StatusBadgeStyleInput {
  variant: StatusBadgeVariant;
  isDark: boolean;
}

/**
 * Glassy badge style — same visual family as getOwnBadgeStyle().
 * Uses backdrop-filter blur + subtle white border + soft shadow,
 * but with a distinct color per status.
 */
export const getStatusBadgeStyle = ({
  variant,
  isDark,
}: StatusBadgeStyleInput): React.CSSProperties => {
  // Per-variant base color (light mode tint + dark mode deeper tint)
  const palette: Record<
    StatusBadgeVariant,
    { light: string; dark: string; borderLight: string; borderDark: string }
  > = {
    active: {
      light: 'rgba(40, 167, 69, 0.85)',
      dark: 'rgba(22, 101, 52, 0.78)',
      borderLight: 'rgba(255, 255, 255, 0.35)',
      borderDark: 'rgba(74, 222, 128, 0.55)',
    },
    disabled: {
      light: 'rgba(255, 193, 7, 0.88)',
      dark: 'rgba(133, 100, 4, 0.82)',
      borderLight: 'rgba(255, 255, 255, 0.4)',
      borderDark: 'rgba(255, 213, 79, 0.6)',
    },
    completed: {
      light: 'rgba(23, 162, 184, 0.85)',
      dark: 'rgba(22, 78, 99, 0.78)',
      borderLight: 'rgba(255, 255, 255, 0.35)',
      borderDark: 'rgba(32, 201, 224, 0.55)',
    },
    deleted: {
      light: 'rgba(220, 53, 69, 0.85)',
      dark: 'rgba(122, 26, 34, 0.82)',
      borderLight: 'rgba(255, 255, 255, 0.35)',
      borderDark: 'rgba(248, 113, 113, 0.55)',
    },
    featured: {
      light: 'rgba(212, 175, 55, 0.9)',       
      dark: 'rgba(120, 88, 12, 0.85)',         // deep gold (dark mode)
      borderLight: 'rgba(255, 245, 200, 0.5)', // soft champagne
      borderDark: 'rgba(255, 215, 0, 0.65)',   // bright gold glow
    },
    pending: {
      light: 'rgba(255, 167, 38, 0.88)',
      dark: 'rgba(146, 79, 14, 0.82)',
      borderLight: 'rgba(255, 255, 255, 0.4)',
      borderDark: 'rgba(255, 200, 87, 0.6)',
    },
    rejected: {
      light: 'rgba(220, 53, 69, 0.85)',
      dark: 'rgba(122, 26, 34, 0.82)',
      borderLight: 'rgba(255, 255, 255, 0.35)',
      borderDark: 'rgba(248, 113, 113, 0.55)',
    },
  };

  const colors = palette[variant];

  return {
    backgroundColor: isDark ? colors.dark : colors.light,
    color: '#FFFFFF',
    border: isDark
      ? `1px solid ${colors.borderDark}`
      : `1px solid ${colors.borderLight}`,
    backdropFilter: 'blur(12px) saturate(180%)',
    WebkitBackdropFilter: 'blur(12px) saturate(180%)',
    boxShadow: isDark
      ? '0 4px 14px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      : '0 4px 14px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
  };
};