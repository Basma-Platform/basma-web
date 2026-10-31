import type { IconType } from 'react-icons';
import {
  FaBell,
  FaEnvelope,
  FaCheckCircle,
  FaTimesCircle,
  FaTrash,
  FaBan,
  FaClock,
  FaClipboardCheck,
  FaUserCheck,
  FaUserTimes,
  FaShieldAlt,
  FaStar,
  FaStarHalfAlt,
  FaFlag,
  FaCheck,
  FaGavel,
  FaSyncAlt,
  FaVideo,
  FaExclamationTriangle,
  FaInfoCircle,
  FaHandHoldingHeart,
  FaBullhorn,
} from 'react-icons/fa';
import type { NotificationType } from '../../types';
import { getNotificationColor } from '../../utils/notificationHelpers';

interface NotificationIconProps {
  type: NotificationType;
  size?: number;
  color?: string;
  /** When true, wraps the icon in a tinted rounded square */
  withBackground?: boolean;
  /** Size of the background square (only when withBackground = true) */
  bgSize?: number;
}

/**
 * Icon renderer for notifications.
 * - Default: bare icon
 * - withBackground: icon inside a tinted, rounded square using the
 *   notification type's color as the tint.
 */
const NotificationIcon = ({
  type,
  size = 18,
  color,
  withBackground = false,
  bgSize,
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
    verification_submitted_user: FaClock,
    verification_submitted_admin: FaClipboardCheck,
    verification_approved: FaUserCheck,
    verification_rejected: FaUserTimes,
    verification_image_deleted: FaShieldAlt,

    // ============================================
    // Sprint 04 — Ratings
    // ============================================
    rating_received: FaStar,
    rating_updated: FaStarHalfAlt,

    // ============================================
    // Sprint 04 — Reports
    // ============================================
    new_report_received: FaFlag,
    report_processed: FaCheck,
    report_action_taken: FaGavel,

    // ============================================
    // Sprint 05 — Announcements
    // ============================================
    announcement_completed: FaCheckCircle,
    announcement_reopened: FaSyncAlt,

    // ============================================
    // SPRINT 06 — Basma Fund
    // ============================================
    help_request_submitted_user: FaHandHoldingHeart,
    help_request_submitted_admin: FaHandHoldingHeart,
    help_request_approved: FaCheckCircle,
    help_request_rejected: FaTimesCircle,
    donation_inquiry_received: FaHandHoldingHeart,
    donation_inquiry_status_changed: FaSyncAlt,
    video_access_granted: FaVideo,
    suspicious_video_access: FaExclamationTriangle,

    // ============================================
    // SPRINT 06 — Community Posts
    // ============================================
    community_post_submitted_user: FaClipboardCheck,
    community_post_submitted_admin: FaBullhorn,
    community_post_approved: FaCheckCircle,
    community_post_rejected: FaTimesCircle,

    // ============================================
    // Fallback
    // ============================================
    general: FaInfoCircle,
  };

  const Icon = iconMap[type] || FaInfoCircle;

  // Resolve the icon color:
  // - explicit `color` prop wins
  // - otherwise, use the notification type's mapped color
  const resolvedColor = color ?? getNotificationColor(type);

  // ─── Bare icon ───
  if (!withBackground) {
    return <Icon size={size} color={resolvedColor} />;
  }

  // ─── Icon inside tinted rounded square ───
  const squareSize = bgSize ?? size * 2;

  return (
    <span
      style={{
        width: `${squareSize}px`,
        height: `${squareSize}px`,
        borderRadius: '10px',
        backgroundColor: `${resolvedColor}15`,
        border: `1px solid ${resolvedColor}25`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: resolvedColor,
      }}
      aria-hidden="true"
    >
      <Icon size={size} />
    </span>
  );
};

export default NotificationIcon;