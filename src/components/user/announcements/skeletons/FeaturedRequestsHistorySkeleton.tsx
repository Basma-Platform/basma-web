import { motion } from 'framer-motion';

const FeaturedRequestsHistorySkeleton = ({ count = 3 }: { count?: number }) => {
  const SkeletonBlock = ({
    height,
    borderRadius = '10px',
    style,
  }: {
    height: string;
    borderRadius?: string;
    style?: React.CSSProperties;
  }) => (
    <motion.div
      animate={{ opacity: [0.35, 0.75, 0.35] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        height,
        borderRadius,
        backgroundColor: 'var(--border-color)',
        ...style,
      }}
    />
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '1rem 1.15rem 1rem 1.25rem',
            display: 'flex',
            gap: '14px',
            alignItems: 'flex-start',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 2px 8px var(--shadow-sm)',
          }}
        >
          {/* Cover Image Skeleton */}
          <SkeletonBlock height="70px" borderRadius="12px" style={{ width: '70px', flexShrink: 0 }} />

          {/* Content Area Skeleton */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 }}>
            {/* Header: Title and Badge Skeleton */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
              <SkeletonBlock height="16px" borderRadius="6px" style={{ width: '55%' }} />
              <SkeletonBlock height="22px" borderRadius="8px" style={{ width: '75px', flexShrink: 0 }} />
            </div>

            {/* Info Grid Skeletons */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: '8px',
                marginTop: '4px',
              }}
            >
              <SkeletonBlock height="26px" borderRadius="6px" />
              <SkeletonBlock height="26px" borderRadius="6px" />
              <SkeletonBlock height="26px" borderRadius="6px" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedRequestsHistorySkeleton;