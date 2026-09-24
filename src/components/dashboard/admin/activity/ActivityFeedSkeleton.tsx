import { motion } from 'framer-motion';

interface ActivityFeedSkeletonProps {
  count?: number;
}

/**
 * Skeleton for ActivityFeed
 * Matches the 2-column grid layout:
 * - 2 items per row on desktop
 * - 1 item per row on mobile
 */
const ActivityFeedSkeleton = ({ count = 6 }: ActivityFeedSkeletonProps) => {
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

  return (
    <div
      dir="rtl"
      className="activity-skeleton-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: '8px',
        width: '100%',
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            padding: '12px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          {/* Icon badge */}
          <div style={{ width: '38px', flexShrink: 0 }}>
            <Bone height="38px" />
          </div>

          {/* Content */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              minWidth: 0,
            }}
          >
            {/* Title row + time */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div style={{ flex: 1 }}>
                <Bone height="14px" />
              </div>
              <div style={{ width: '60px', flexShrink: 0 }}>
                <Bone height="12px" />
              </div>
            </div>

            {/* Description */}
            <div style={{ width: '70%' }}>
              <Bone height="11px" />
            </div>

            {/* Actor row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <div style={{ width: '20px', flexShrink: 0 }}>
                <Bone height="20px" />
              </div>
              <div style={{ width: '80px' }}>
                <Bone height="12px" />
              </div>
              <div style={{ width: '50px' }}>
                <Bone height="14px" />
              </div>
            </div>
          </div>
        </div>
      ))}

      <style>{`
        @media (max-width: 768px) {
          .activity-skeleton-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ActivityFeedSkeleton;