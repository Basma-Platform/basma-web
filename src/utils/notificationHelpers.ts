import type { NotificationType } from '../types';

// ============================================
// Icon Name Mapping
// (used by NotificationItem, NOT Activity Feed)
// ============================================

export const getNotificationIconName = (type: NotificationType): string => {
  const map: Record<NotificationType, string> = {
    // ============================================
    // Sprint 03 — Featured
    // ============================================
    featured_request_received_user: 'mail',
    featured_request_received_admin: 'bell',
    featured_request_approved: 'check-circle',
    featured_request_rejected: 'times-circle',
    announcement_auto_deleted: 'trash',
    announcement_permanently_deleted: 'ban',

    // ============================================
    // Sprint 04 — Verification (KYC)
    // ============================================
    verification_submitted_user: 'clock',
    verification_submitted_admin: 'clipboard-check',
    verification_approved: 'user-check',
    verification_rejected: 'user-times',
    verification_image_deleted: 'shield-alt',

    // ============================================
    // Sprint 04 — Ratings
    // ============================================
    rating_received: 'star',
    rating_updated: 'star-half-alt',

    // ============================================
    // Sprint 04 — Reports
    // ============================================
    new_report_received: 'flag',
    report_processed: 'check',
    report_action_taken: 'gavel',

    // ============================================
    // Sprint 05 — Announcements
    // ============================================
    announcement_completed: 'check-circle',
    announcement_reopened: 'refresh-cw',

    // ============================================
    // SPRINT 06 — Basma Fund (صندوق بصمة)
    // ============================================
    help_request_submitted_user: 'hand-holding-heart',
    help_request_submitted_admin: 'hand-holding-heart',
    help_request_approved: 'check-circle',
    help_request_rejected: 'times-circle',
    donation_inquiry_received: 'hand-holding-heart',
    donation_inquiry_status_changed: 'sync-alt',
    video_access_granted: 'video',
    suspicious_video_access: 'exclamation-triangle',

    // ============================================
    // Fallback
    // ============================================
    general: 'info-circle',
  };
  return map[type] || 'info-circle';
};

// ============================================
// Color Mapping
// ============================================

export const getNotificationColor = (type: NotificationType): string => {
  const map: Record<NotificationType, string> = {
    // Sprint 03 — Featured
    featured_request_received_user: '#E87A20',
    featured_request_received_admin: '#E87A20',
    featured_request_approved: '#28A745',
    featured_request_rejected: '#DC3545',
    announcement_auto_deleted: '#D46A1A',
    announcement_permanently_deleted: '#6B4226',

    // Sprint 04 — Verification
    verification_submitted_user: '#17A2B8',
    verification_submitted_admin: '#17A2B8',
    verification_approved: '#28A745',
    verification_rejected: '#DC3545',
    verification_image_deleted: '#6F42C1',

    // Sprint 04 — Ratings
    rating_received: '#F5A623',
    rating_updated: '#FFC107',

    // Sprint 04 — Reports
    new_report_received: '#E87A20',
    report_processed: '#28A745',
    report_action_taken: '#DC3545',

    // Sprint 05 — Announcements
    announcement_completed: '#17A2B8',
    announcement_reopened: '#28A745',

    // SPRINT 06 — Basma Fund
    help_request_submitted_user: '#17A2B8',
    help_request_submitted_admin: '#17A2B8',
    help_request_approved: '#28A745',
    help_request_rejected: '#DC3545',
    donation_inquiry_received: '#17A2B8',
    donation_inquiry_status_changed: '#FFC107',
    video_access_granted: '#9C27B0',
    suspicious_video_access: '#FF9800',

    // Fallback
    general: '#6B4226',
  };
  return map[type] || '#6B4226';
};

// ============================================
// Background Color (light tint)
// ============================================

export const getNotificationBgColor = (type: NotificationType): string => {
  const color = getNotificationColor(type);
  return `${color}15`;
};

// ============================================
// Time Formatting
// ============================================

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

// ============================================
// Grouping
// ============================================

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

export const getNotificationGroupLabel = (key: string): string => {
  const map: Record<string, string> = {
    today: 'اليوم',
    yesterday: 'أمس',
    thisWeek: 'هذا الأسبوع',
    older: 'أقدم',
  };
  return map[key] || '';
};