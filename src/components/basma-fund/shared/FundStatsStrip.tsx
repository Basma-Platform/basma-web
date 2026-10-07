import { motion } from 'framer-motion';
import { FaHandHoldingHeart, FaEye } from 'react-icons/fa';
import type { IconType } from 'react-icons';
import type { BasmaFundPublicStats } from '../../../types';

interface FundStatsStripProps {
  stats: BasmaFundPublicStats | null;
  loading?: boolean;
}

interface StatItem {
  Icon: IconType;
  label: string;
  value: number;
  accent: string;
  hint?: string;
}

/**
 * Public stats strip for Basma Fund.
 *
 * Currently shows the 2 stats the backend provides:
 *  - total_published help requests
 *  - total views
 *
 * Layout:
 *  - Mobile (< 640px)  → 1 column (stacked, full width, all content visible)
 *  - Tablet+ (>= 640px) → 2 columns side by side
 */
const FundStatsStrip = ({ stats, loading = false }: FundStatsStripProps) => {
  const items: StatItem[] = [
    {
      Icon: FaHandHoldingHeart,
      label: 'طلب مساعدة منشور',
      value: stats?.help_requests.total_published ?? 0,
      accent: '#17A2B8',
      hint: 'طلبات موثقة ومنشورة على المنصة',
    },
    {
      Icon: FaEye,
      label: 'مشاهدة للطلبات',
      value: stats?.help_requests.total_views ?? 0,
      accent: '#E87A20',
      hint: 'مجموع مشاهدات المتبرعين والمهتمين',
    },
  ];

  return (
    <div className="fund-stats-grid">
      {items.map((item, idx) => {
        const Icon = item.Icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="fund-stats-card"
            style={{
              padding: '18px 16px',
              borderRadius: '18px',
              backgroundColor: 'var(--bg-card)',
              border: `1px solid var(--border-color)`,
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              boxShadow: '0 2px 10px var(--shadow-sm)',
              fontFamily: 'Cairo, sans-serif',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              transition:
                'box-shadow 0.3s ease, border-color 0.3s ease, background-color 0.3s ease',
              minWidth: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 16px 36px ${item.accent}30`;
              e.currentTarget.style.borderColor = item.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 10px var(--shadow-sm)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
          >
            {/* Top accent bar (revealed on hover) */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.35 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: `linear-gradient(90deg, ${item.accent}, ${item.accent}aa)`,
                transformOrigin: 'right',
              }}
            />

            {/* Icon bubble */}
            <motion.div
              whileHover={{ rotate: 8, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 320, damping: 16 }}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '13px',
                background: `linear-gradient(135deg, ${item.accent}, ${item.accent}cc)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: `0 4px 12px ${item.accent}40`,
                flexShrink: 0,
              }}
            >
              <Icon size={18} />
            </motion.div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  color: 'var(--text-primary)',
                  fontSize: 'clamp(1.15rem, 3vw, 1.4rem)',
                  fontWeight: 900,
                  lineHeight: 1.1,
                  fontFamily:
                    "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
                  fontVariantNumeric: 'lining-nums tabular-nums',
                }}
              >
                {loading ? (
                  <span
                    className="fund-stats-skel"
                    style={{
                      display: 'inline-block',
                      width: '56px',
                      height: '20px',
                      borderRadius: '6px',
                    }}
                  />
                ) : (
                  item.value.toLocaleString('en-US')
                )}
              </div>
              <div
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  marginTop: '3px',
                }}
              >
                {item.label}
              </div>
              {item.hint && (
                <div
                  className="fund-stats-hint"
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.68rem',
                    fontWeight: 500,
                    marginTop: '3px',
                    opacity: 0.65,
                    lineHeight: 1.5,
                  }}
                >
                  {item.hint}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}

      <style>{`
        /* ✅ Mobile first: stack vertically, full width */
        .fund-stats-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          width: 100%;
        }

        /* Tablet and up: side by side */
        @media (min-width: 640px) {
          .fund-stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        .fund-stats-skel {
          background-color: var(--border-color);
          animation: fundStatsPulse 1.4s ease-in-out infinite;
        }
        @keyframes fundStatsPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.85; }
        }
      `}</style>
    </div>
  );
};

export default FundStatsStrip;