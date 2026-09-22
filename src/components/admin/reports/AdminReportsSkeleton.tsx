interface AdminReportsSkeletonProps {
  variant?: 'list' | 'stats' | 'detail';
  count?: number;
}

const AdminReportsSkeleton = ({
  variant = 'list',
  count = 6,
}: AdminReportsSkeletonProps) => {
  const Styles = () => (
    <style>{`
      @keyframes reportSkelPulse {
        0% { opacity: 0.4; }
        50% { opacity: 0.85; }
        100% { opacity: 0.4; }
      }
      .report-card-skel-shimmer {
        animation: reportSkelPulse 1.5s ease-in-out infinite;
        background-color: var(--border-color);
      }
    `}</style>
  );

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
      className="report-card-skel-shimmer"
      style={{
        height,
        width,
        borderRadius,
        backgroundColor: 'var(--border-color)',
        ...style,
      }}
    />
  );

  // ============================================
  // Stats
  // ============================================
  if (variant === 'stats') {
    return (
      <>
        <Styles />
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
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <SkeletonBlock
                height="42px"
                width="42px"
                borderRadius="12px"
                style={{ flexShrink: 0 }}
              />
              <div style={{ flex: 1 }}>
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
  // List (default)
  // ============================================
  return (
    <>
      <Styles />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '16px',
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '1rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px',
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
                <SkeletonBlock
                  height="32px"
                  width="32px"
                  borderRadius="50%"
                  style={{ flexShrink: 0 }}
                />
                <div style={{ flex: 1 }}>
                  <SkeletonBlock
                    height="10px"
                    width="40%"
                    style={{ marginBottom: '6px' }}
                  />
                  <SkeletonBlock height="12px" width="60%" />
                </div>
              </div>
              <SkeletonBlock
                height="22px"
                width="70px"
                borderRadius="8px"
              />
            </div>
            <SkeletonBlock
              height="52px"
              borderRadius="10px"
              style={{ marginBottom: '10px' }}
            />
            <SkeletonBlock
              height="36px"
              borderRadius="10px"
              style={{ marginBottom: '10px' }}
            />
            <SkeletonBlock height="20px" borderRadius="8px" />
          </div>
        ))}
      </div>
    </>
  );
};

export default AdminReportsSkeleton;