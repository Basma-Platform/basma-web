import { motion } from 'framer-motion';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';

interface FeaturedStatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

interface BadgeConfig {
  label: string;
  color: string;
  bg: string;
  border: string;
  Icon: IconType;
}

const FeaturedStatusBadge = ({
  status,
  size = 'md',
  animated = false,
}: FeaturedStatusBadgeProps) => {
  const getConfig = (): BadgeConfig => {
    switch (status) {
      case 'pending':
        return {
          label: 'قيد المراجعة',
          color: '#E87A20',
          bg: 'rgba(232, 122, 32, 0.12)',
          border: 'rgba(232, 122, 32, 0.3)',
          Icon: FaHourglassHalf,
        };
      case 'approved':
        return {
          label: 'تمت الموافقة',
          color: '#28A745',
          bg: 'rgba(40, 167, 69, 0.12)',
          border: 'rgba(40, 167, 69, 0.3)',
          Icon: FaCheckCircle,
        };
      case 'rejected':
        return {
          label: 'مرفوض',
          color: '#DC3545',
          bg: 'rgba(220, 53, 69, 0.12)',
          border: 'rgba(220, 53, 69, 0.3)',
          Icon: FaTimesCircle,
        };
    }
  };

  const config = getConfig();
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

  // Animated pulse for pending status
  const shouldAnimate = animated && status === 'pending';

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: shouldAnimate ? [1, 1.03, 1] : 1,
      }}
      transition={{
        opacity: { duration: 0.2 },
        scale: shouldAnimate
          ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
          : { duration: 0.2 },
      }}
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
      }}
    >
      {/* Hourglass icon spins for pending */}
      {shouldAnimate ? (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'inline-flex' }}
        >
          <Icon size={sizeConfig.iconSize} />
        </motion.span>
      ) : (
        <Icon size={sizeConfig.iconSize} />
      )}
      {config.label}
    </motion.span>
  );
};

export default FeaturedStatusBadge;