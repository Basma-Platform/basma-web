import type { NotificationType } from '../types';

/**
 * Get icon name for notification type
 * (Component will map this to actual React Icon)
 */
export const getNotificationIconName = (
  type: NotificationType
): string => {
  const map: Record<NotificationType, string> = {
    // Sprint 03 — Featured
    featured_request_received_user: 'mail',
    featured_request_received_admin: 'bell',
    featured_request_approved: 'check-circle',
    featured_request_rejected: 'times-circle',
    announcement_auto_deleted: 'trash',
    announcement_permanently_deleted: 'ban',
    // Sprint 04 — Verification
    verification_submitted_user: 'shield-alt',
    verification_submitted_admin: 'shield-alt',
    verification_approved: 'user-check',
    verification_rejected: 'user-times',
    // Sprint 04 — Ratings
    rating_received: 'star',
    rating_updated: 'star-half-alt',
    // Fallback
    general: 'info-circle',
  };
  return map[type] || 'info-circle';
};

/**
 * Get color for notification type
 */
export const getNotificationColor = (type: NotificationType): string => {
  const map: Record<NotificationType, string> = {
    // ============================================
    // Sprint 03 — Featured
    // ============================================
    featured_request_received_user: '#E87A20',
    featured_request_received_admin: '#E87A20',
    featured_request_approved: '#28A745',
    featured_request_rejected: '#DC3545',
    announcement_auto_deleted: '#D46A1A',
    announcement_permanently_deleted: '#6B4226',

    // ============================================
    // Sprint 04 — Verification (KYC)
    // ============================================
    verification_submitted_user: '#17A2B8',
    verification_submitted_admin: '#17A2B8',
    verification_approved: '#28A745',
    verification_rejected: '#DC3545',

    // ============================================
    // Sprint 04 — Ratings
    // ============================================
    rating_received: '#F5A623',
    rating_updated: '#FFC107',

    // ============================================
    // Fallback
    // ============================================
    general: '#6B4226',
  };
  return map[type] || '#6B4226';
};

/**
 * Get background color (light) for notification type
 */
export const getNotificationBgColor = (type: NotificationType): string => {
  const color = getNotificationColor(type);
  return `${color}15`; // ~8% opacity
};

/**
 * Format notification time (relative)
 */
export const formatNotificationTime = (date: string): string => {
  const now = new Date();
  const notificationDate = new Date(date);
  const diffInSeconds = Math.floor(
    (now.getTime() - notificationDate.getTime()) / 1000
  );

  if (diffInSeconds < 60) return 'الآن';
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `منذ ${minutes} دقيقة`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return hours === 1 ? 'منذ ساعة' : `منذ ${hours} ساعات`;
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return days === 1 ? 'منذ يوم' : `منذ ${days} أيام`;
  }
  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return weeks === 1 ? 'منذ أسبوع' : `منذ ${weeks} أسابيع`;
  }
  const months = Math.floor(diffInSeconds / 2592000);
  return months === 1 ? 'منذ شهر' : `منذ ${months} أشهر`;
};

/**
 * Group notifications by date
 */
export const groupNotificationsByDate = <T extends { created_at: string }>(
  notifications: T[]
): Record<string, T[]> => {
  const groups: Record<string, T[]> = {
    today: [],
    yesterday: [],
    thisWeek: [],
    older: [],
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  notifications.forEach((notification) => {
    const date = new Date(notification.created_at);
    if (date >= today) {
      groups.today.push(notification);
    } else if (date >= yesterday) {
      groups.yesterday.push(notification);
    } else if (date >= weekAgo) {
      groups.thisWeek.push(notification);
    } else {
      groups.older.push(notification);
    }
  });

  return groups;
};

/**
 * Get group label in Arabic
 */
export const getNotificationGroupLabel = (key: string): string => {
  const map: Record<string, string> = {
    today: 'اليوم',
    yesterday: 'أمس',
    thisWeek: 'هذا الأسبوع',
    older: 'أقدم',
  };
  return map[key] || '';
};