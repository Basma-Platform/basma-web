import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaExclamationTriangle,
  FaShieldAlt,
  FaInfoCircle,
  FaCheckCircle,
} from 'react-icons/fa';
import type { UserWarnings } from '../../../types';
import {
  getWarningLevelConfig,
  getWarningProgressPercent,
} from '../../../utils/warningHelpers';
import { useTheme } from '../../../context/ThemeContext';

interface WarningCardProps {
  warnings?: UserWarnings;
  /** Optional variant — 'card' (default, full) or 'compact' */
  variant?: 'card' | 'compact';
}

/**
 * Returns a darker (light mode) or lighter (dark mode) shade of the given
 * level color, so text/icons stay readable against both backgrounds.
 *
 * We keep the "semantic" hue intact so users still recognize yellow/orange/red
 * as warning levels — we only adjust luminance.
 */
const getContrastColor = (
  level: 'clean' | 'warning' | 'last_warning' | 'critical',
  isDark: boolean
): string => {
  if (isDark) {
    // Dark mode: brighter shades for readability on dark backgrounds
    const map = {
      clean: '#4FCB6E',
      warning: '#FFD54F',
      last_warning: '#FFB74D',
      critical: '#FF7A88',
    };
    return map[level];
  }
  // Light mode: darker shades for readability on cream/beige backgrounds
  const map = {
    clean: '#1B7B37',
    warning: '#8A6D00',
    last_warning: '#B85A0F',
    critical: '#B02433',
  };
  return map[level];
};

/**
 * Background tint adjusted per theme — lighter in light mode for subtlety,
 * deeper in dark mode for proper contrast.
 */
const getBackgroundTint = (
  level: 'clean' | 'warning' | 'last_warning' | 'critical',
  isDark: boolean
): string => {
  if (isDark) {
    const map = {
      clean: 'rgba(40,167,69,0.12)',
      warning: 'rgba(255,193,7,0.14)',
      last_warning: 'rgba(232,122,32,0.16)',
      critical: 'rgba(220,53,69,0.16)',
    };
    return map[level];
  }
  const map = {
    clean: 'rgba(40,167,69,0.08)',
    warning: 'rgba(255,193,7,0.10)',
    last_warning: 'rgba(232,122,32,0.10)',
    critical: 'rgba(220,53,69,0.10)',
  };
  return map[level];
};

/**
 * Border tint — must be visible against the card background.
 */
const getBorderTint = (
  level: 'clean' | 'warning' | 'last_warning' | 'critical',
  isDark: boolean
): string => {
  if (isDark) {
    const map = {
      clean: 'rgba(40,167,69,0.40)',
      warning: 'rgba(255,193,7,0.45)',
      last_warning: 'rgba(232,122,32,0.50)',
      critical: 'rgba(220,53,69,0.50)',
    };
    return map[level];
  }
  const map = {
    clean: 'rgba(27,123,55,0.35)',
    warning: 'rgba(138,109,0,0.35)',
    last_warning: 'rgba(184,90,15,0.40)',
    critical: 'rgba(176,36,51,0.40)',
  };
  return map[level];
};

const WarningCard = ({ warnings, variant = 'card' }: WarningCardProps) => {
  const { isDark } = useTheme();

  // Nothing to show when clean
  if (!warnings || warnings.count <= 0) return null;

  const config = getWarningLevelConfig(warnings.status.level);
  const percent = getWarningProgressPercent(
    warnings.count,
    warnings.threshold
  );
  const isLast = warnings.status.level === 'last_warning';
  const isCompact = variant === 'compact';

  // ✅ Theme-aware colors
  const textColor = getContrastColor(warnings.status.level, isDark);
  const bgTint = getBackgroundTint(warnings.status.level, isDark);
  const borderTint = getBorderTint(warnings.status.level, isDark);

  // ============================================
  // Compact variant
  // ============================================
  if (isCompact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 14px',
          borderRadius: '12px',
          backgroundColor: bgTint,
          border: `1px solid ${borderTint}`,
          fontFamily: 'Cairo, sans-serif',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '9px',
            background: config.gradient,
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: `0 4px 10px ${textColor}40`,
          }}
        >
          <FaExclamationTriangle size={13} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '0.82rem',
              fontWeight: 800,
              color: textColor,
              marginBottom: '2px',
            }}
          >
            لديك {warnings.count} من {warnings.threshold} تحذيرات
          </div>
          {warnings.status.message && (
            <div
              style={{
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                lineHeight: 1.4,
              }}
            >
              {warnings.status.message}
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // ============================================
  // Full card variant
  // ============================================
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: `1.5px solid ${borderTint}`,
        borderRadius: '16px',
        padding: '1.25rem 1.35rem',
        boxShadow: `0 4px 16px ${bgTint}`,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Cairo, sans-serif',
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          height: '4px',
          background: config.gradient,
        }}
      />

      {/* Pulse glow when last_warning */}
      {isLast && (
        <motion.div
          animate={{ opacity: [0.15, 0.35, 0.15] }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: textColor,
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />
      )}

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: config.gradient,
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: `0 6px 16px ${textColor}45`,
            }}
          >
            <FaExclamationTriangle size={18} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: '1rem',
                fontWeight: 900,
                color: textColor,
                marginBottom: '2px',
                lineHeight: 1.3,
              }}
            >
              {isLast ? 'تحذير أخير!' : 'التحذيرات'}
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
              }}
            >
              {/* ✅ UPDATED TEXT */}
              التزم بسياسات المنصة لتجنب تعليق حسابك
            </div>
          </div>

          {/* Right badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 10px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-input)',
              border: `1px solid ${borderTint}`,
              fontFamily:
                "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
              fontVariantNumeric: 'tabular-nums',
              fontSize: '0.8rem',
              fontWeight: 900,
              color: textColor,
              flexShrink: 0,
            }}
          >
            <span>{warnings.count}</span>
            <span style={{ opacity: 0.5 }}>/</span>
            <span style={{ opacity: 0.7 }}>{warnings.threshold}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: '10px',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
            marginBottom: '12px',
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: config.gradient,
              borderRadius: '10px',
              boxShadow: `0 0 12px ${textColor}70`,
            }}
          />
        </div>

        {/* Message */}
        {warnings.status.message && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '10px',
              backgroundColor: bgTint,
              border: `1px solid ${borderTint}`,
              marginBottom: '10px',
            }}
          >
            <FaInfoCircle
              size={12}
              color={textColor}
              style={{ flexShrink: 0, marginTop: '2px' }}
            />
            <span
              style={{
                fontSize: '0.8rem',
                color: textColor,
                lineHeight: 1.6,
                fontWeight: 600,
              }}
            >
              {warnings.status.message}
            </span>
          </div>
        )}

        {/* Remaining hint */}
        {warnings.remaining > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              marginBottom: '12px',
            }}
          >
            <FaShieldAlt size={11} color={textColor} />
            <span>
              متبقي لك{' '}
              <strong style={{ color: textColor }}>
                {warnings.remaining}{' '}
                {warnings.remaining === 1 ? 'تحذير' : 'تحذيرات'}
              </strong>{' '}
              قبل التعليق التلقائي
            </span>
          </div>
        )}

        {/* Footer hint */}
        <div
          style={{
            paddingTop: '10px',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
            }}
          >
            <FaCheckCircle size={10} color={textColor} />
            <span>راجع إرشادات الاستخدام لتفادي المزيد من التحذيرات</span>
          </div>

          <Link
            to="/contact"
            style={{
              color: textColor,
              fontSize: '0.75rem',
              fontWeight: 800,
              textDecoration: 'none',
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            تواصل مع الدعم ←
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default WarningCard;