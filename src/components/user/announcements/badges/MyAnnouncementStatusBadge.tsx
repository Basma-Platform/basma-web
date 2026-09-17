import { motion } from 'framer-motion';
import {
  FaCheckCircle,
  FaPauseCircle,
  FaStar,
  FaClock,
  FaTimesCircle,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';

interface MyAnnouncementStatusBadgeProps {
  status: 'active' | 'disabled' | 'deleted';
  isFeatured?: boolean;
  featuredRequestStatus?: 'pending' | 'approved' | 'rejected' | null;
  size?: 'sm' | 'md' | 'lg';
}

interface BadgeConfig {
  label: string;
  color: string;
  bg: string;
  border: string;
  Icon: IconType;
}

const MyAnnouncementStatusBadge = ({
  status,
  isFeatured = false,
  featuredRequestStatus = null,
  size = 'md',
}: MyAnnouncementStatusBadgeProps) => {
  // ✅ Determine which badge to show (priority-based)
  const getBadgeConfig = (): BadgeConfig => {
    // 1. Featured (highest priority)
    if (isFeatured) {
      return {
        label: 'مميز',
        color: '#F5A623',
        bg: 'rgba(245, 166, 35, 0.18)',
        border: 'rgba(245, 166, 35, 0.4)',
        Icon: FaStar,
      };
    }

    // 2. Pending featured request
    if (featuredRequestStatus === 'pending') {
      return {
        label: 'قيد المراجعة',
        color: '#FFA726',
        bg: 'rgba(255, 167, 38, 0.18)',
        border: 'rgba(255, 167, 38, 0.4)',
        Icon: FaClock,
      };
    }

    // 3. Rejected featured request
    if (featuredRequestStatus === 'rejected') {
      return {
        label: 'تمييز مرفوض',
        color: '#DC3545',
        bg: 'rgba(220, 53, 69, 0.18)',
        border: 'rgba(220, 53, 69, 0.4)',
        Icon: FaTimesCircle,
      };
    }

    // 4. Regular status
    switch (status) {
      case 'active':
        return {
          label: 'نشط',
          color: '#28A745',
          bg: 'rgba(40, 167, 69, 0.18)',
          border: 'rgba(40, 167, 69, 0.4)',
          Icon: FaCheckCircle,
        };
      case 'disabled':
        return {
          label: 'معطل',
          color: '#FFC107',
          bg: 'rgba(255, 193, 7, 0.2)',
          border: 'rgba(255, 193, 7, 0.45)',
          Icon: FaPauseCircle,
        };
      case 'deleted':
      default:
        return {
          label: 'محذوف',
          color: '#DC3545',
          bg: 'rgba(220, 53, 69, 0.18)',
          border: 'rgba(220, 53, 69, 0.4)',
          Icon: FaTimesCircle,
        };
    }
  };

  const config = getBadgeConfig();
  const { Icon } = config;

  // Size configurations
  const sizes = {
    sm: {
      padding: '3px 10px',
      fontSize: '0.65rem',
      iconSize: 10,
      gap: '4px',
      borderRadius: '8px',
    },
    md: {
      padding: '4px 12px',
      fontSize: '0.72rem',
      iconSize: 11,
      gap: '5px',
      borderRadius: '10px',
    },
    lg: {
      padding: '6px 16px',
      fontSize: '0.8rem',
      iconSize: 13,
      gap: '6px',
      borderRadius: '12px',
    },
  };

  const sizeConfig = sizes[size];

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: sizeConfig.gap,
        padding: sizeConfig.padding,
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
        borderRadius: sizeConfig.borderRadius,
        fontSize: sizeConfig.fontSize,
        fontWeight: 700,
        fontFamily: 'Cairo, sans-serif',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        // ✅ Featured gets special glow
        boxShadow: isFeatured
          ? `0 2px 8px ${config.color}30`
          : 'none',
      }}
    >
      <Icon size={sizeConfig.iconSize} />
      {config.label}
    </motion.span>
  );
};

export default MyAnnouncementStatusBadge;