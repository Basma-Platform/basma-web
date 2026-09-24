import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface DashboardSectionProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  delay?: number;
  noPadding?: boolean;
}

/**
 * Reusable section wrapper for Admin Dashboard
 * - Consistent header (icon + title + subtitle + action)
 * - Framer Motion entry animation
 * - Fully responsive (mobile-first)
 */
const DashboardSection = ({
  title,
  subtitle,
  icon,
  action,
  children,
  delay = 0,
  noPadding = false,
}: DashboardSectionProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      dir="rtl"
      style={{
        marginBottom: '1.5rem',
        width: '100%',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            minWidth: 0,
            flex: '1 1 auto',
          }}
        >
          {icon && (
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background:
                  'linear-gradient(135deg, rgba(232,122,32,0.12), rgba(232,122,32,0.04))',
                color: 'var(--primary-orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: '1rem',
              }}
            >
              {icon}
            </div>
          )}
          <div style={{ minWidth: 0, flex: 1 }}>
            <h3
              style={{
                color: 'var(--text-secondary)',
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
                margin: 0,
                lineHeight: 1.3,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {title}
            </h3>
            {subtitle && (
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: 'clamp(0.7rem, 0.9vw, 0.78rem)',
                  margin: '2px 0 0',
                  lineHeight: 1.4,
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

      {/* Content */}
      <div
        style={{
          padding: noPadding ? 0 : undefined,
          width: '100%',
        }}
      >
        {children}
      </div>
    </motion.section>
  );
};

export default DashboardSection;