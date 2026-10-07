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
  FaFlag,
  FaClock,
  FaClipboardCheck,
  FaCheck,
  FaGavel,
  FaFlagCheckered,
  FaUndo,
  FaHandHoldingHeart,
  FaSyncAlt,
  FaVideo,
  FaExclamationTriangle,
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
    announcement_completed: FaFlagCheckered,
    announcement_reopened: FaUndo,

    // ============================================
    // Sprint 06 — Basma Fund (صندوق بصمة)
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