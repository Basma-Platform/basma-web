interface AdminHelpRequestSkeletonProps {
  variant?: 'list' | 'stats' | 'detail';
  count?: number;
}

const AdminHelpRequestSkeleton = ({
  variant = 'list',
  count = 6,
}: AdminHelpRequestSkeletonProps) => {
  const Shimmer = ({
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
      className="admin-hr-skel-shimmer"
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
      @keyframes adminHrSkelPulse {
        0% { opacity: 0.4; }
        50% { opacity: 0.85; }
        100% { opacity: 0.4; }
      }
      .admin-hr-skel-shimmer {
        animation: adminHrSkelPulse 1.5s ease-in-out infinite;
      }
      .admin-hr-skel-status-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }
      .admin-hr-skel-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 16px;
      }
      @media (min-width: 768px) {
        .admin-hr-skel-status-grid {
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
        }
      }
      @media (max-width: 380px) {
        .admin-hr-skel-status-grid {
          grid-template-columns: 1fr;
          gap: 8px;
        }
      }
    `}</style>
  );

  if (variant === 'stats') {
    return (
      <>
        <Styles />
        <div className="admin-hr-skel-status-grid">
          {Array.from({ length: 5 }).map((_, i) => (
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
              <Shimmer
                height="42px"
                width="42px"
                borderRadius="12px"
                style={{ flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <Shimmer
                  height="18px"
                  width="60%"
                  style={{ marginBottom: '6px' }}
                />
                <Shimmer height="10px" width="80%" />
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (variant === 'detail') {
    return (
      <>
        <Styles />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Shimmer height="90px" borderRadius="16px" />
          <Shimmer height="180px" borderRadius="16px" />
          <Shimmer height="140px" borderRadius="16px" />
          <Shimmer height="140px" borderRadius="16px" />
        </div>
      </>
    );
  }

  return (
    <>
      <Styles />
      <div className="admin-hr-skel-grid">
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
              <Shimmer
                height="44px"
                width="44px"
                borderRadius="50%"
                style={{ flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <Shimmer
                  height="12px"
                  width="60%"
                  style={{ marginBottom: '6px' }}
                />
                <Shimmer height="10px" width="40%" />
              </div>
              <Shimmer height="22px" width="70px" borderRadius="8px" />
            </div>
            <Shimmer
              height="76px"
              borderRadius="10px"
              style={{ marginBottom: '10px' }}
            />
            <div
              style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                paddingTop: '10px',
                borderTop: '1px solid var(--border-color)',
              }}
            >
              <Shimmer height="14px" width="60px" borderRadius="4px" />
              <Shimmer height="14px" width="80px" borderRadius="4px" />
              <div style={{ marginLeft: 'auto' }}>
                <Shimmer height="20px" width="90px" borderRadius="6px" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AdminHelpRequestSkeleton;