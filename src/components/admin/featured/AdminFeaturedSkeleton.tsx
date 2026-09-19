interface AdminFeaturedSkeletonProps {
  variant?: 'list' | 'stats' | 'detail';
  count?: number;
}

const AdminFeaturedSkeleton = ({
  variant = 'list',
  count = 6,
}: AdminFeaturedSkeletonProps) => {
  const SkeletonBlock = ({
    height,
    width,
    borderRadius = '10px',
    style,
  }: {
    height: string;
    width?: string;
    borderRadius?: string;
    style?: React.CSSProperties;
  }) => (
    <div
      className="admin-featured-skel-shimmer"
      style={{
        height,
        width,
        borderRadius,
        backgroundColor: 'var(--border-color)',
        ...style,
      }}
    />
  );

  const Styles = () => (
    <style>{`
      @keyframes adminFeaturedSkelPulse {
        0% { opacity: 0.4; }
        50% { opacity: 0.85; }
        100% { opacity: 0.4; }
      }
      .admin-featured-skel-shimmer {
        animation: adminFeaturedSkelPulse 1.5s ease-in-out infinite;
      }
      .admin-featured-skel-status-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }
      .admin-featured-skel-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 16px;
      }
      @media (min-width: 768px) {
        .admin-featured-skel-status-grid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }
      }
      @media (max-width: 380px) {
        .admin-featured-skel-status-grid {
          grid-template-columns: 1fr;
          gap: 8px;
        }
      }
    `}</style>
  );

  // ============================================
  // Stats
  // ============================================
  if (variant === 'stats') {
    return (
      <>
        <Styles />
        <div className="admin-featured-skel-status-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '14px',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxSizing: 'border-box',
              }}
            >
              <SkeletonBlock
                height="42px"
                width="42px"
                borderRadius="12px"
                style={{ flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <SkeletonBlock
                  height="18px"
                  width="60%"
                  style={{ marginBottom: '6px' }}
                />
                <SkeletonBlock height="10px" width="80%" />
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  // ============================================
  // Detail
  // ============================================
  if (variant === 'detail') {
    return (
      <>
        <Styles />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <SkeletonBlock height="70px" borderRadius="14px" />
          <SkeletonBlock height="120px" borderRadius="14px" />
          <SkeletonBlock height="140px" borderRadius="14px" />
        </div>
      </>
    );
  }

  // ============================================
  // List
  // ============================================
  return (
    <>
      <Styles />
      <div className="admin-featured-skel-grid">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '1rem',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '12px',
              }}
            >
              <SkeletonBlock
                height="44px"
                width="44px"
                borderRadius="50%"
                style={{ flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <SkeletonBlock
                  height="12px"
                  width="60%"
                  style={{ marginBottom: '6px' }}
                />
                <SkeletonBlock height="10px" width="40%" />
              </div>
              <SkeletonBlock height="22px" width="70px" borderRadius="8px" />
            </div>
            <SkeletonBlock
              height="68px"
              borderRadius="10px"
              style={{ marginBottom: '10px' }}
            />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: '8px',
              }}
            >
              <SkeletonBlock height="46px" borderRadius="10px" />
              <SkeletonBlock height="46px" borderRadius="10px" />
              <SkeletonBlock height="46px" borderRadius="10px" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AdminFeaturedSkeleton;