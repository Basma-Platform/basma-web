interface RatingSkeletonProps {
  variant?: 'card' | 'summary' | 'stats' | 'distribution';
  count?: number;
}

const RatingSkeleton = ({
  variant = 'card',
  count = 3,
}: RatingSkeletonProps) => {
  const SkeletonBlock = ({
    height,
    width,
    borderRadius = '8px',
    style,
  }: {
    height: string;
    width?: string;
    borderRadius?: string;
    style?: React.CSSProperties;
  }) => (
    <div
      className="rating-skeleton-shimmer"
      style={{
        height,
        width,
        borderRadius,
        backgroundColor: 'var(--border-color)',
        ...style,
      }}
    />
  );

  const styles = (
    <style>{`
      @keyframes ratingShimmerPulse {
        0% { opacity: 0.4; }
        50% { opacity: 0.85; }
        100% { opacity: 0.4; }
      }
      .rating-skeleton-shimmer {
        animation: ratingShimmerPulse 1.5s ease-in-out infinite;
      }
    `}</style>
  );

  // ============================================
  // Card variant
  // ============================================
  if (variant === 'card') {
    return (
      <>
        {styles}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '1rem 1.15rem',
              }}
            >
              <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
                <SkeletonBlock
                  height="48px"
                  width="48px"
                  borderRadius="50%"
                  style={{ flexShrink: 0 }}
                />
                <div style={{ flex: 1 }}>
                  <SkeletonBlock
                    height="12px"
                    width="40%"
                    style={{ marginBottom: '8px' }}
                  />
                  <SkeletonBlock height="10px" width="60%" />
                </div>
              </div>
              <SkeletonBlock
                height="14px"
                width="90%"
                style={{ marginBottom: '6px' }}
              />
              <SkeletonBlock height="14px" width="70%" />
            </div>
          ))}
        </div>
      </>
    );
  }

  // ============================================
  // Summary variant
  // ============================================
  if (variant === 'summary') {
    return (
      <>
        {styles}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '18px',
            padding: '1.5rem',
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <SkeletonBlock
            height="100px"
            width="100px"
            borderRadius="16px"
            style={{ flexShrink: 0 }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <SkeletonBlock
              height="20px"
              width="40%"
              style={{ marginBottom: '12px' }}
            />
            <SkeletonBlock
              height="14px"
              width="60%"
              style={{ marginBottom: '8px' }}
            />
            <SkeletonBlock height="14px" width="80%" />
          </div>
        </div>
      </>
    );
  }

  // ============================================
  // Stats variant (4 cards)
  // ============================================
  if (variant === 'stats') {
    return (
      <>
        {styles}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px',
          }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '14px',
                padding: '1rem',
              }}
            >
              <SkeletonBlock
                height="12px"
                width="60%"
                style={{ marginBottom: '12px' }}
              />
              <SkeletonBlock height="24px" width="40%" />
            </div>
          ))}
        </div>
      </>
    );
  }

  // ============================================
  // Distribution variant (5 bars)
  // ============================================
  return (
    <>
      {styles}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <SkeletonBlock height="12px" width="30px" />
            <SkeletonBlock
              height="8px"
              borderRadius="4px"
              style={{ flex: 1 }}
            />
            <SkeletonBlock height="10px" width="40px" />
          </div>
        ))}
      </div>
    </>
  );
};

export default RatingSkeleton;