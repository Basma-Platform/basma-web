import { motion } from 'framer-motion';

interface ChartsSkeletonProps {
  count?: number;
}

/**
 * Skeleton for ChartsGrid
 * Matches the actual grid:
 * - 2 columns on desktop
 * - Full-width cards (activity_overview, payment_methods) span 2 cols
 * - 1 column on mobile
 */
const ChartsSkeleton = ({ count = 8 }: ChartsSkeletonProps) => {
  const Bone = ({ height = '100%' }: { height?: string }) => (
    <motion.div
      animate={{ opacity: [0.35, 0.75, 0.35] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        height,
        borderRadius: '8px',
        backgroundColor: 'var(--border-color)',
        width: '100%',
      }}
    />
  );

  // Match actual card order + full-width flags
  // 1. user_growth          → normal (2/row)
  // 2. announcements_created → normal (2/row)
  // 3. activity_overview    → FULL WIDTH
  // 4. announcements_by_category → normal
  // 5. announcements_by_governorate → normal
  // 6. reports_status       → normal
  // 7. verification_status  → normal
  // 8. payment_methods      → FULL WIDTH
  const CARD_LAYOUT = [
    { height: 320, fullWidth: false },
    { height: 320, fullWidth: false },
    { height: 380, fullWidth: true },
    { height: 300, fullWidth: false },
    { height: 300, fullWidth: false },
    { height: 300, fullWidth: false },
    { height: 300, fullWidth: false },
    { height: 320, fullWidth: true },
  ];

  const items = CARD_LAYOUT.slice(0, count);

  return (
    <div
      dir="rtl"
      className="charts-skeleton-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '12px',
        width: '100%',
      }}
    >
      {items.map((item, i) => (
        <div
          key={i}
          className={item.fullWidth ? 'charts-skeleton-full' : ''}
          style={{
            position: 'relative',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '1rem',
            overflow: 'hidden',
            minHeight: `${item.height}px`,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Top bar */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              left: 0,
              height: '3px',
              backgroundColor: 'var(--border-color)',
              opacity: 0.5,
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
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flex: 1,
              }}
            >
              <div style={{ width: '32px', flexShrink: 0 }}>
                <Bone height="32px" />
              </div>
              <div style={{ flex: 1 }}>
                <Bone height="14px" />
              </div>
            </div>
            <div style={{ width: '80px', flexShrink: 0 }}>
              <Bone height="32px" />
            </div>
          </div>

          {/* Chart body */}
          <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
            <Bone height="100%" />
          </div>
        </div>
      ))}

      <style>{`
        @media (max-width: 768px) {
          .charts-skeleton-grid {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }
        }

        /* Full-width cards span 2 columns on wide screens */
        @media (min-width: 1400px) {
          .charts-skeleton-full {
            grid-column: span 2;
          }
        }
      `}</style>
    </div>
  );
};

export default ChartsSkeleton;