import { motion } from 'framer-motion';
import {
  FaCheck,
  FaClock,
  FaStar,
  FaCrown,
  FaRocket,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import type { FeaturedPricing } from '../../../../types';

interface FeaturedPricingCardProps {
  pricing: FeaturedPricing;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

/**
 * Returns tier styling based on duration:
 *  - 7 days  → Basic
 *  - 14 days → Popular
 *  - 30 days → Best Value
 */
const getTierConfig = (
  duration: number
): {
  label: string | null;
  Icon: IconType;
  accent: string;
  accentDark: string;
  gradient: string;
  badgeColor: string;
} => {
  if (duration === 7) {
    return {
      label: null,
      Icon: FaRocket,
      accent: '#17A2B8',
      accentDark: '#138496',
      gradient: 'linear-gradient(135deg, #17A2B8, #20C9E0)',
      badgeColor: 'rgba(23,162,184,0.15)',
    };
  }

  if (duration === 14) {
    return {
      label: 'الأكثر طلباً',
      Icon: FaStar,
      accent: '#E87A20',
      accentDark: '#D46A1A',
      gradient: 'linear-gradient(135deg, #E87A20, #F5A623)',
      badgeColor: 'rgba(232,122,32,0.15)',
    };
  }

  if (duration === 30) {
    return {
      label: 'أفضل قيمة',
      Icon: FaCrown,
      accent: '#9C27B0',
      accentDark: '#7B1FA2',
      gradient: 'linear-gradient(135deg, #9C27B0, #BA68C8)',
      badgeColor: 'rgba(156,39,176,0.15)',
    };
  }

  // Fallback
  return {
    label: null,
    Icon: FaClock,
    accent: '#8B5A2B',
    accentDark: '#6B4226',
    gradient: 'linear-gradient(135deg, #8B5A2B, #C49A6C)',
    badgeColor: 'rgba(139,90,43,0.15)',
  };
};

const FeaturedPricingCard = ({
  pricing,
  isSelected,
  onSelect,
  disabled = false,
}: FeaturedPricingCardProps) => {
  const tier = getTierConfig(pricing.duration_days);
  const { Icon } = tier;

  return (
    <motion.button
      type="button"
      onClick={() => !disabled && onSelect()}
      disabled={disabled}
      whileHover={!disabled ? { y: -6, scale: 1.015 } : {}}
      whileTap={!disabled ? { scale: 0.985 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      dir="rtl"
      style={{
        position: 'relative',
        width: '100%',
        textAlign: 'right',
        padding: '1.25rem 1.15rem',
        borderRadius: '18px',
        border: `2px solid ${
          isSelected ? tier.accent : 'var(--border-color)'
        }`,
        backgroundColor: isSelected
          ? `${tier.accent}0A`
          : 'var(--bg-card)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'Cairo, sans-serif',
        transition: 'all 0.25s ease',
        boxShadow: isSelected
          ? `0 12px 32px ${tier.accent}30, 0 4px 12px ${tier.accent}20`
          : '0 2px 12px var(--shadow-sm)',
        opacity: disabled ? 0.6 : 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* ============================================ */}
      {/* Top Accent Bar */}
      {/* ============================================ */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          height: '4px',
          background: tier.gradient,
          opacity: isSelected ? 1 : 0.35,
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* ============================================ */}
      {/* Top-Right Badge (Popular/Best Value) */}
      {/* ============================================ */}
      {tier.label && (
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, delay: 0.15 }}
          style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            padding: '3px 10px',
            borderRadius: '8px',
            background: tier.gradient,
            color: '#FFFFFF',
            fontSize: '0.6rem',
            fontWeight: 900,
            boxShadow: `0 4px 12px ${tier.accent}50`,
            letterSpacing: '0.3px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Icon size={9} />
          {tier.label}
        </motion.div>
      )}

      {/* ============================================ */}
      {/* Selection Indicator */}
      {/* ============================================ */}
      <motion.div
        animate={{
          scale: isSelected ? 1 : 0,
          opacity: isSelected ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        style={{
          position: 'absolute',
          top: '14px',
          right: '14px',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: tier.gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          boxShadow: `0 4px 12px ${tier.accent}50`,
          zIndex: 2,
        }}
      >
        <FaCheck size={11} />
      </motion.div>

      {/* ============================================ */}
      {/* Icon */}
      {/* ============================================ */}
      <div
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '13px',
          background: isSelected
            ? tier.gradient
            : tier.badgeColor,
          color: isSelected ? '#FFFFFF' : tier.accent,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.25s ease',
          boxShadow: isSelected
            ? `0 6px 16px ${tier.accent}40`
            : 'none',
        }}
      >
        <Icon size={20} />
      </div>

      {/* ============================================ */}
      {/* Duration */}
      {/* ============================================ */}
      <div>
        <div
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1rem',
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: '2px',
          }}
        >
          {pricing.duration_label}
        </div>
        <div
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.72rem',
          }}
        >
          مدة التمييز
        </div>
      </div>

      {/* ============================================ */}
      {/* Price */}
      {/* ============================================ */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '6px',
          paddingTop: '10px',
          borderTop: `1px dashed ${
            isSelected ? `${tier.accent}40` : 'var(--border-color)'
          }`,
        }}
      >
        <span
          style={{
            color: isSelected ? tier.accent : 'var(--text-primary)',
            fontSize: '1.75rem',
            fontWeight: 900,
            lineHeight: 1,
            fontFamily:
              "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
            fontVariantNumeric: 'lining-nums tabular-nums',
            direction: 'ltr',
            transition: 'color 0.25s ease',
          }}
        >
          {pricing.price.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          })}
        </span>
        <span
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            fontWeight: 700,
          }}
        >
          {pricing.currency === 'ILS' ? '₪' : pricing.currency}
        </span>
      </div>

      {/* ============================================ */}
      {/* Selection CTA */}
      {/* ============================================ */}
      <motion.div
        animate={{
          backgroundColor: isSelected ? tier.accent : 'transparent',
          color: isSelected ? '#FFFFFF' : tier.accent,
          borderColor: tier.accent,
        }}
        transition={{ duration: 0.2 }}
        style={{
          padding: '9px 14px',
          borderRadius: '10px',
          border: `1.5px solid ${tier.accent}`,
          fontSize: '0.78rem',
          fontWeight: 800,
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          marginTop: 'auto',
        }}
      >
        {isSelected ? (
          <>
            <FaCheck size={11} />
            تم الاختيار
          </>
        ) : (
          <>
            اختر هذه الباقة
          </>
        )}
      </motion.div>
    </motion.button>
  );
};

export default FeaturedPricingCard;