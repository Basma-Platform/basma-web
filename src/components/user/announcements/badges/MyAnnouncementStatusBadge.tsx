import { motion } from 'framer-motion';
import {
  FaCheckCircle,
  FaPauseCircle,
  FaStar,
  FaClock,
  FaTimesCircle,
  FaFlagCheckered,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import { useTheme } from '../../../../context/ThemeContext';
import { getStatusBadgeStyle } from '../../../../utils/announcementHelpers';

interface MyAnnouncementStatusBadgeProps {
  status: 'active' | 'disabled' | 'completed' | 'deleted';
  isFeatured?: boolean;
  featuredRequestStatus?: 'pending' | 'approved' | 'rejected' | null;
  size?: 'sm' | 'md' | 'lg';
}

type BadgeVariant =
  | 'active'
  | 'disabled'
  | 'completed'
  | 'deleted'
  | 'featured'
  | 'pending'
  | 'rejected';

interface BadgeConfig {
  label: string;
  variant: BadgeVariant;
  Icon: IconType;
}

const MyAnnouncementStatusBadge = ({
  status,
  isFeatured = false,
  featuredRequestStatus = null,
  size = 'md',
}: MyAnnouncementStatusBadgeProps) => {
  const { isDark } = useTheme();

  // ============================================
  // Priority-based badge selection
  // ============================================
  const getBadgeConfig = (): BadgeConfig => {
    // 1. Completed (highest priority)
    if (status === 'completed') {
      return {
        label: 'مكتمل',
        variant: 'completed',
        Icon: FaFlagCheckered,
      };
    }

    // 2. Featured
    if (isFeatured) {
      return {
        label: 'مميز',
        variant: 'featured',
        Icon: FaStar,
      };
    }

    // 3. Pending featured request
    if (featuredRequestStatus === 'pending') {
      return {
        label: 'قيد المراجعة',
        variant: 'pending',
        Icon: FaClock,
      };
    }

    // 4. Rejected featured request
    if (featuredRequestStatus === 'rejected') {
      return {
        label: 'تمييز مرفوض',
        variant: 'rejected',
        Icon: FaTimesCircle,
      };
    }

    // 5. Standard statuses
    switch (status) {
      case 'active':
        return {
          label: 'نشط',
          variant: 'active',
          Icon: FaCheckCircle,
        };
      case 'disabled':
        return {
          label: 'معطل',
          variant: 'disabled',
          Icon: FaPauseCircle,
        };
      case 'deleted':
      default:
        return {
          label: 'محذوف',
          variant: 'deleted',
          Icon: FaTimesCircle,
        };
    }
  };

  const config = getBadgeConfig();
  const { Icon } = config;

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

  // ✅ Glassy style from shared helper
  const glassyStyle = getStatusBadgeStyle({
    variant: config.variant,
    isDark,
  });

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      style={{
        ...glassyStyle,
        display: 'inline-flex',
        alignItems: 'center',
        gap: sizeConfig.gap,
        padding: sizeConfig.padding,
        borderRadius: sizeConfig.borderRadius,
        fontSize: sizeConfig.fontSize,
        fontWeight: 700,
        fontFamily: 'Cairo, sans-serif',
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon size={sizeConfig.iconSize} />
      {config.label}
    </motion.span>
  );
};

export default MyAnnouncementStatusBadge;