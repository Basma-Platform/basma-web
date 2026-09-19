import {
  FaEnvelope,
  FaBell,
  FaCheckCircle,
  FaTimesCircle,
  FaTrash,
  FaBan,
  FaInfoCircle,
  FaShieldAlt,
  FaUserCheck,
  FaUserTimes,
  FaStar,
  FaStarHalfAlt,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import type { NotificationType } from '../../types';
import { getNotificationColor } from '../../utils/notificationHelpers';

interface NotificationIconProps {
  type: NotificationType;
  size?: number;
  withBackground?: boolean;
  bgSize?: number;
}

/**
 * Renders the appropriate icon based on notification type
 * with the correct color from the theme.
 */
const NotificationIcon = ({
  type,
  size = 16,
  withBackground = false,
  bgSize = 36,
}: NotificationIconProps) => {
  const iconMap: Record<NotificationType, IconType> = {
    // ============================================
    // Sprint 03 — Featured
    // ============================================
    featured_request_received_user: FaEnvelope,
    featured_request_received_admin: FaBell,
    featured_request_approved: FaCheckCircle,
    featured_request_rejected: FaTimesCircle,
    announcement_auto_deleted: FaTrash,
    announcement_permanently_deleted: FaBan,

    // ============================================
    // Sprint 04 — Verification (KYC)
    // ============================================
    verification_submitted_user: FaShieldAlt,
    verification_submitted_admin: FaShieldAlt,
    verification_approved: FaUserCheck,
    verification_rejected: FaUserTimes,

    // ============================================
    // Sprint 04 — Ratings
    // ============================================
    rating_received: FaStar,
    rating_updated: FaStarHalfAlt,

    // ============================================
    // Fallback
    // ============================================
    general: FaInfoCircle,
  };

  const Icon = iconMap[type] || FaInfoCircle;
  const color = getNotificationColor(type);

  if (!withBackground) {
    return <Icon size={size} color={color} />;
  }

  return (
    <div
      style={{
        width: `${bgSize}px`,
        height: `${bgSize}px`,
        borderRadius: '10px',
        backgroundColor: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Icon size={size} color={color} />
    </div>
  );
};

export default NotificationIcon;