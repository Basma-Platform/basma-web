import type {
  CommunityPostType,
  CommunityPostStatus,
  CommunityDisplayNameType,
  CommunityExpiryChoice,
} from '../types';

// ============================================
// THEME — Community Pillar (Purple)
// ============================================
export const COMMUNITY_THEME = {
  accent: '#9C27B0',
  accentDark: '#7B1FA2',
  accentLight: '#BA68C8',
  accentSoft: 'rgba(156, 39, 176, 0.10)',
  accentSoftDark: 'rgba(156, 39, 176, 0.18)',
  gradient: 'linear-gradient(135deg, #9C27B0, #BA68C8)',
  gradientDeep: 'linear-gradient(135deg, #7B1FA2, #9C27B0)',
  shadow: 'rgba(156, 39, 176, 0.35)',
} as const;

// ============================================
// TYPES — Labels / Colors
// ============================================

export const COMMUNITY_TYPE_LABELS: Record<CommunityPostType, string> = {
  warning: 'تحذير',
  lost: 'مفقود',
  found: 'موجود',
  general: 'عام',
};

export const COMMUNITY_TYPE_COLORS: Record<CommunityPostType, string> = {
  warning: '#DC3545',
  lost: '#E87A20',
  found: '#28A745',
  general: '#17A2B8',
};

export const COMMUNITY_TYPE_SOFT_BG: Record<CommunityPostType, string> = {
  warning: 'rgba(220, 53, 69, 0.10)',
  lost: 'rgba(232, 122, 32, 0.10)',
  found: 'rgba(40, 167, 69, 0.10)',
  general: 'rgba(23, 162, 184, 0.10)',
};

export const getCommunityTypeLabel = (type: CommunityPostType): string =>
  COMMUNITY_TYPE_LABELS[type] ?? type;

export const getCommunityTypeColor = (type: CommunityPostType): string =>
  COMMUNITY_TYPE_COLORS[type] ?? COMMUNITY_THEME.accent;

export const getCommunityTypeBg = (type: CommunityPostType): string =>
  COMMUNITY_TYPE_SOFT_BG[type] ?? COMMUNITY_THEME.accentSoft;

// ============================================
// STATUS
// ============================================

export const COMMUNITY_STATUS_LABELS: Record<CommunityPostStatus, string> = {
  pending: 'قيد المراجعة',
  approved: 'منشور',
  rejected: 'مرفوض',
  resolved: 'تم الحل',
  expired: 'منتهي الصلاحية',
};

export const COMMUNITY_STATUS_COLORS: Record<CommunityPostStatus, string> = {
  pending: '#FFC107',
  approved: '#28A745',
  rejected: '#DC3545',
  resolved: '#17A2B8',
  expired: '#6C757D',
};

export const getCommunityStatusLabel = (
  status: CommunityPostStatus
): string => COMMUNITY_STATUS_LABELS[status] ?? status;

export const getCommunityStatusColor = (
  status: CommunityPostStatus
): string => COMMUNITY_STATUS_COLORS[status] ?? '#6C757D';

export const getCommunityStatusBg = (status: CommunityPostStatus): string =>
  `${getCommunityStatusColor(status)}15`;

// ============================================
// DISPLAY NAME
// ============================================

export const COMMUNITY_DISPLAY_LABELS: Record<
  CommunityDisplayNameType,
  string
> = {
  full: 'الاسم الكامل',
  anonymous: 'مجهول',
  custom: 'اسم مخصص',
};

export const getCommunityDisplayLabel = (
  type: CommunityDisplayNameType
): string => COMMUNITY_DISPLAY_LABELS[type] ?? type;

// ============================================
// EXPIRY
// ============================================

export const COMMUNITY_EXPIRY_LABELS: Record<CommunityExpiryChoice, string> = {
  '1_month': 'شهر واحد',
  '2_months': 'شهران',
};

export const getCommunityExpiryLabel = (
  choice: CommunityExpiryChoice
): string => COMMUNITY_EXPIRY_LABELS[choice] ?? choice;

// ============================================
// BUSINESS RULES
// ============================================

export const COMMUNITY_MAX_ACTIVE_POSTS = 3;
export const COMMUNITY_MAX_POSTS_PER_MONTH = 3;
export const COMMUNITY_MAX_IMAGES_PER_POST = 4;
export const COMMUNITY_MAX_PINNED_GLOBAL = 3;

export const COMMUNITY_AUTO_EXPIRING_TYPES: CommunityPostType[] = [
  'warning',
  'general',
];

export const COMMUNITY_RESOLVABLE_TYPES: CommunityPostType[] = [
  'lost',
  'found',
];

export const isAutoExpiringType = (type: CommunityPostType): boolean =>
  COMMUNITY_AUTO_EXPIRING_TYPES.includes(type);

export const isResolvableType = (type: CommunityPostType): boolean =>
  COMMUNITY_RESOLVABLE_TYPES.includes(type);

// ============================================
// TIME HELPERS
// ============================================

export const formatCommunityTimeAgo = (date: string | null): string => {
  if (!date) return '';
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

export const formatCommunityDate = (date: string | null): string => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// ============================================
// MISC
// ============================================

export const COMMUNITY_POST_PLACEHOLDER = '/placeholder-community.png';

export const getPinnedBadgeLabel = (): string => 'مثبّت';

export const getViewsLabel = (count: number): string =>
  count === 1 ? 'مشاهدة واحدة' : `${count.toLocaleString('en-US')} مشاهدة`;

export const getClicksLabel = (count: number): string =>
  count === 1 ? 'نقرة واتساب' : `${count.toLocaleString('en-US')} نقرة`;