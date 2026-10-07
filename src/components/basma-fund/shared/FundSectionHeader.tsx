import type { IconType } from 'react-icons';
import { motion } from 'framer-motion';

interface FundSectionHeaderProps {
  Icon: IconType;
  title: string;
  subtitle?: string;
  /** Teal by default; pass a different accent for achievements section */
  accent?: string;
  /** Optional right-side action (e.g. "عرض الكل") */
  action?: React.ReactNode;
}

/**
 * Section header used across Basma Fund pages.
 * Mirrors the visual language of FeaturedCarousel's header.
 */
const FundSectionHeader = ({
  Icon,
  title,
  subtitle,
  accent = '#17A2B8',
  action,
}: FundSectionHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '1.25rem',
        flexWrap: 'wrap',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          minWidth: 0,
          flex: 1,
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '13px',
            background: `linear-gradient(135deg, ${accent}, ${accent}dd)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 6px 18px ${accent}40`,
            flexShrink: 0,
            color: '#FFFFFF',
          }}
        >
          <Icon size={18} />
        </motion.div>

        <div style={{ minWidth: 0 }}>
          <h3
            style={{
              color: 'var(--text-secondary)',
              fontSize: 'clamp(1.1rem, 3vw, 1.35rem)',
              fontWeight: 900,
              fontFamily: 'Cairo, sans-serif',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {title}
          </h3>
          {subtitle && (
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                fontFamily: 'Cairo, sans-serif',
                margin: '4px 0 0',
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {action}
    </motion.div>
  );
};

export default FundSectionHeader;