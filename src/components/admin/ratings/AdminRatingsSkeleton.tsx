const AdminRatingsSkeleton = ({ count = 6 }: { count?: number }) => {
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
      className="admin-rating-skeleton-shimmer"
      style={{
        height,
        width,
        borderRadius,
        backgroundColor: 'var(--border-color)',
        ...style,
      }}
    />
  );

  return (
    <>
      <style>{`
        @keyframes adminRatingShimmer {
          0% { opacity: 0.35; }
          50% { opacity: 0.8; }
          100% { opacity: 0.35; }
        }
        .admin-rating-skeleton-shimmer {
          animation: adminRatingShimmer 1.5s ease-in-out infinite;
        }
      `}</style>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.25rem',
        }}
        dir="rtl"
      >
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              minWidth: 0,
              boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
            }}
          >
            {/* Users row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SkeletonBlock height="36px" width="36px" borderRadius="50%" />
                <SkeletonBlock height="12px" width="90px" />
              </div>
              <SkeletonBlock height="24px" width="70px" borderRadius="12px" />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SkeletonBlock height="12px" width="90px" />
                <SkeletonBlock height="36px" width="36px" borderRadius="50%" />
              </div>
            </div>

            {/* Rating pill */}
            <SkeletonBlock height="38px" borderRadius="12px" />

            {/* Comment */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <SkeletonBlock height="12px" width="100%" borderRadius="6px" />
              <SkeletonBlock height="12px" width="75%" borderRadius="6px" />
            </div>

            {/* Footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '12px',
                marginTop: '4px',
                borderTop: '1px solid var(--border-color)',
              }}
            >
              <SkeletonBlock height="10px" width="90px" />
              <SkeletonBlock height="28px" width="65px" borderRadius="8px" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AdminRatingsSkeleton;