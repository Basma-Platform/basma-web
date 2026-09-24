import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  delay?: number;
  /** Optional height for the chart area */
  minHeight?: string;
  /** Span across full row on desktop */
  fullWidth?: boolean;
  /** Show empty state instead of chart (when no data) */
  isEmpty?: boolean;
}

/**
 * Universal wrapper for charts
 * - Header with icon + title + action
 * - Consistent padding + border + shadow
 * - Empty state when no data
 * - Framer Motion entry
 */
const ChartCard = ({
  title,
  subtitle,
  icon,
  action,
  children,
  delay = 0,
  minHeight = '280px',
  fullWidth = false,
  isEmpty = false,
}: ChartCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      dir="rtl"
      className={`chart-card ${fullWidth ? 'chart-card-full' : ''}`}
      style={{
        position: 'relative',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1rem',
        overflow: 'hidden',
        boxShadow: '0 4px 16px var(--shadow-sm)',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        minHeight: minHeight,
        fontFamily: 'Cairo, sans-serif',
        width: '100%',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 24px var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 16px var(--shadow-sm)';
      }}
    >
      {/* Top Gradient Bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          height: '3px',
          background:
            'linear-gradient(90deg, var(--primary-orange), var(--primary-orange-light))',
          opacity: 0.7,
        }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          marginBottom: '12px',
          flexWrap: 'wrap',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minWidth: 0,
            flex: '1 1 auto',
          }}
        >
          {icon && (
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '9px',
                background:
                  'linear-gradient(135deg, rgba(232,122,32,0.12), rgba(232,122,32,0.04))',
                color: 'var(--primary-orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: '0.85rem',
              }}
            >
              {icon}
            </div>
          )}
          <div style={{ minWidth: 0, flex: 1 }}>
            <h4
              style={{
                color: 'var(--text-secondary)',
                fontSize: 'clamp(0.82rem, 1.1vw, 0.9rem)',
                fontWeight: 800,
                margin: 0,
                lineHeight: 1.25,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {title}
            </h4>
            {subtitle && (
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: 'clamp(0.65rem, 0.85vw, 0.7rem)',
                  margin: '2px 0 0',
                  lineHeight: 1.3,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {action && <div style={{ flexShrink: 0 }}>{action}</div>}
      </div>

      {/* Chart Area OR Empty State */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          width: '100%',
          position: 'relative',
        }}
      >
        {isEmpty ? (
          <EmptyState />
        ) : (
          children
        )}
      </div>

      <style>{`
        @media (min-width: 1400px) {
          .chart-card-full {
            grid-column: span 2;
          }
        }
      `}</style>
    </motion.div>
  );
};

// ============================================
// Empty State — shown when no data
// ============================================
const EmptyState = () => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-muted)',
      gap: '10px',
      textAlign: 'center',
      padding: '1rem',
    }}
  >
    <div
      style={{
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: 'var(--bg-input)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        opacity: 0.6,
      }}
    >
      📊
    </div>
    <div>
      <p
        style={{
          margin: 0,
          fontSize: '0.82rem',
          fontWeight: 700,
          fontFamily: 'Cairo, sans-serif',
          color: 'var(--text-secondary)',
        }}
      >
        لا توجد بيانات كافية
      </p>
      <p
        style={{
          margin: '4px 0 0',
          fontSize: '0.7rem',
          opacity: 0.7,
          fontFamily: 'Cairo, sans-serif',
        }}
      >
        جرّب تغيير الفترة الزمنية
      </p>
    </div>
  </div>
);

export default ChartCard;