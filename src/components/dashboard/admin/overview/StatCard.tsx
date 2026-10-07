import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  color: string;
  bgColor: string;
  gradient: string;
  link?: string;
  badge?: string | number;
  badgeColor?: string;
  trend?: {
    value: number;
    label?: string;
    positiveIsGood?: boolean;
  };
  delay?: number;
  /** Compact mode for smaller grid */
  compact?: boolean;
}

/**
 * Universal StatCard for Admin Dashboard
 * - Metallic gradient top bar
 * - Glow orb in corner
 * - Optional link → clickable with hover arrow
 * - Optional trend badge (up/down %)
 * - Fully responsive
 */
const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  color,
  bgColor,
  gradient,
  link,
  badge,
  badgeColor,
  trend,
  delay = 0,
  compact = false,
}: StatCardProps) => {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') return val.toLocaleString('en-US');
    return val;
  };

  const isClickable = !!link;

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={isClickable ? { y: -4 } : undefined}
      style={{
        position: 'relative',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: compact ? '14px' : '16px',
        padding: compact ? '0.9rem' : '1.15rem',
        overflow: 'hidden',
        boxShadow: '0 4px 16px var(--shadow-sm)',
        transition: 'all 0.3s ease',
        cursor: isClickable ? 'pointer' : 'default',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Cairo, sans-serif',
        textAlign: 'right',
        width: '100%',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 12px 32px ${color}25`;
        e.currentTarget.style.borderColor = `${color}50`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 16px var(--shadow-sm)';
        e.currentTarget.style.borderColor = 'var(--border-color)';
      }}
    >
      {/* Top Gradient Bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          height: '4px',
          background: gradient,
        }}
      />

      {/* Decorative Glow Orb */}
      <div
        style={{
          position: 'absolute',
          bottom: '-40px',
          left: '-40px',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundColor: bgColor,
          opacity: 0.7,
          filter: 'blur(12px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        {/* Header Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            marginBottom: compact ? '8px' : '12px',
          }}
        >
          <span
            style={{
              color: 'var(--text-muted)',
              fontSize: compact ? '0.7rem' : '0.78rem',
              fontWeight: 700,
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              minWidth: 0,
              flex: 1,
            }}
          >
            {title}
          </span>

          <motion.div
            whileHover={{ rotate: 8, scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            style={{
              width: compact ? '34px' : '40px',
              height: compact ? '34px' : '40px',
              borderRadius: compact ? '10px' : '11px',
              background: gradient,
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: `0 6px 14px ${color}40`,
              fontSize: compact ? '0.9rem' : '1rem',
            }}
          >
            {icon}
          </motion.div>
        </div>

        {/* Value */}
        <div
          style={{
            color: 'var(--text-primary)',
            fontSize: compact ? 'clamp(1.2rem, 2.5vw, 1.5rem)' : 'clamp(1.4rem, 2.8vw, 1.85rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            fontFamily:
              "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
            fontVariantNumeric: 'lining-nums tabular-nums',
            direction: 'ltr',
            textAlign: 'right',
            marginBottom: '6px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {formatValue(value)}
        </div>

        {/* Subtitle + Badge Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '6px',
            minHeight: '20px',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              minWidth: 0,
              flex: 1,
            }}
          >
            {subtitle && (
              <span
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  opacity: 0.8,
                }}
              >
                {subtitle}
              </span>
            )}

            {trend && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  padding: '1px 6px',
                  borderRadius: '6px',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  backgroundColor:
                    (trend.positiveIsGood ?? true)
                      ? trend.value >= 0
                        ? 'rgba(40,167,69,0.12)'
                        : 'rgba(220,53,69,0.12)'
                      : trend.value >= 0
                        ? 'rgba(220,53,69,0.12)'
                        : 'rgba(40,167,69,0.12)',
                  color:
                    (trend.positiveIsGood ?? true)
                      ? trend.value >= 0
                        ? '#28A745'
                        : '#DC3545'
                      : trend.value >= 0
                        ? '#DC3545'
                        : '#28A745',
                  direction: 'ltr',
                }}
              >
                {trend.value >= 0 ? '↑' : '↓'}
                {Math.abs(trend.value)}%
              </span>
            )}
          </div>

          {badge !== undefined && badge !== null && badge !== 0 && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '22px',
                height: '20px',
                padding: '0 8px',
                borderRadius: '10px',
                fontSize: '0.65rem',
                fontWeight: 800,
                backgroundColor: badgeColor || color,
                color: '#FFFFFF',
                fontFamily: 'system-ui, sans-serif',
                direction: 'ltr',
              }}
            >
              {typeof badge === 'number' && badge > 99 ? '99+' : badge}
            </span>
          )}

          {isClickable && (
            <FaArrowLeft
              size={10}
              style={{
                color: color,
                opacity: 0.6,
                flexShrink: 0,
              }}
            />
          )}
        </div>
      </div>
    </motion.div>
  );

  if (link) {
    return (
      <Link
        to={link}
        style={{
          textDecoration: 'none',
          color: 'inherit',
          display: 'block',
          height: '100%',
        }}
      >
        {content}
      </Link>
    );
  }

  return content;
};

export default StatCard;