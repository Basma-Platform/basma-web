import { motion } from 'framer-motion';

/**
 * Skeleton for TopPerformersTabs
 * Matches the full-width enhanced layout:
 * - Header (icon + title + subtitle)
 * - 4-column tabs grid
 * - List rows
 */
const TopPerformersSkeleton = () => {
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
      style={{
        position: 'relative',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1.25rem',
        overflow: 'hidden',
        minHeight: '420px',
      }}
    >
      {/* Top gradient bar */}
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
          gap: '12px',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ width: '42px', flexShrink: 0 }}>
          <Bone height="42px" />
        </div>
        <div style={{ flex: 1 }}>
          <Bone height="16px" />
        </div>
      </div>

      {/* 4-column tabs grid */}
      <div
        className="top-skeleton-tabs"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '8px',
          marginBottom: '1.25rem',
          padding: '4px',
          backgroundColor: 'var(--bg-input)',
          borderRadius: '14px',
          border: '1px solid var(--border-color)',
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <Bone height="44px" />
          </div>
        ))}
      </div>

      {/* Rows — matches list item height */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
            }}
          >
            {/* Rank circle */}
            <div style={{ width: '30px', flexShrink: 0 }}>
              <Bone height="30px" />
            </div>

            {/* Avatar */}
            <div style={{ width: '42px', flexShrink: 0 }}>
              <Bone height="42px" />
            </div>

            {/* Text content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <Bone height="14px" />
              <div style={{ width: '55%' }}>
                <Bone height="11px" />
              </div>
            </div>

            {/* Stats on the left */}
            <div
              style={{
                width: '120px',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                alignItems: 'flex-end',
              }}
            >
              <div style={{ width: '80%' }}>
                <Bone height="12px" />
              </div>
              <div style={{ width: '50%' }}>
                <Bone height="10px" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .top-skeleton-tabs {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TopPerformersSkeleton;