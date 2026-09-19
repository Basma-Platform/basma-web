import { motion } from 'framer-motion';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import type { FeaturedRequestStatus } from '../../../../types';

interface FeaturedStatusBadgeProps {
  status: FeaturedRequestStatus;
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
          color: '#FFB800',
          bg: 'rgba(255, 184, 0, 0.15)',
          border: 'rgba(255, 184, 0, 0.4)',
          Icon: FaHourglassHalf,
        };
      case 'approved':
        return {
          label: 'تمت الموافقة',
          color: '#28A745',
          bg: 'rgba(40, 167, 69, 0.12)',
          border: 'rgba(40, 167, 69, 0.35)',
          Icon: FaCheckCircle,
        };
      case 'rejected':
        return {
          label: 'مرفوض',
          color: '#DC3545',
          bg: 'rgba(220, 53, 69, 0.12)',
          border: 'rgba(220, 53, 69, 0.35)',
          Icon: FaTimesCircle,
        };
    }
  };

  const config = getConfig();
  const { Icon } = config;

  const sizes = {
    sm: {
      padding: '3px 9px',
      fontSize: '0.65rem',
      iconSize: 10,
      gap: '4px',
      borderRadius: '8px',
    },
    md: {
      padding: '5px 14px',
      fontSize: '0.75rem',
      iconSize: 12,
      gap: '6px',
      borderRadius: '10px',
    },
    lg: {
      padding: '7px 18px',
      fontSize: '0.82rem',
      iconSize: 14,
      gap: '8px',
      borderRadius: '12px',
    },
  };

  const sizeConfig = sizes[size];
  const shouldAnimate = animated && status === 'pending';

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: 1,
        scale: shouldAnimate ? [1, 1.02, 1] : 1,
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
        fontWeight: 800,
        fontFamily: 'Cairo, sans-serif',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        flexShrink: 0,
        boxShadow: `0 2px 6px ${config.bg}`,
      }}
    >
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