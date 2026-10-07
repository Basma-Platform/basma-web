import { motion } from 'framer-motion';

interface OverviewStatsSkeletonProps {
  count?: number;
}

/**
 * Skeleton for OverviewStatsGrid
 * Shimmer effect — responsive same as grid
 */
const OverviewStatsSkeleton = ({ count = 8 }: OverviewStatsSkeletonProps) => {
  const SkeletonBlock = ({ height = '100%' }: { height?: string }) => (
    <motion.div
      animate={{ opacity: [0.35, 0.75, 0.35] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        height,
        borderRadius: '16px',
        backgroundColor: 'var(--border-color)',
        border: '1px solid var(--border-color)',
        width: '100%',
      }}
    />
  );

  return (
    <div
      dir="rtl"
      className="overview-skeleton-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '12px',
        width: '100%',
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'relative',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '1.15rem',
            overflow: 'hidden',
            minHeight: '130px',
          }}
        >
          {/* Top bar */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              left: 0,
              height: '4px',
              backgroundColor: 'var(--border-color)',
              opacity: 0.5,
            }}
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
            }}
          >
            <SkeletonBlock height="14px" />
            <div style={{ width: '40px' }}>
              <SkeletonBlock height="40px" />
            </div>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <div style={{ width: '60%' }}>
              <SkeletonBlock height="24px" />
            </div>
          </div>

          <div style={{ width: '40%' }}>
            <SkeletonBlock height="12px" />
          </div>
        </div>
      ))}

      <style>{`
        @media (max-width: 640px) {
          .overview-skeleton-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 8px !important;
          }
        }
        @media (max-width: 380px) {
          .overview-skeleton-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default OverviewStatsSkeleton;