interface ReportSkeletonProps {
  variant?: 'reasons' | 'detail';
  count?: number;
}

const ReportSkeleton = ({
  variant = 'reasons',
  count = 5,
}: ReportSkeletonProps) => {
  const Styles = () => (
    <style>{`
      @keyframes reportSkelShimmer {
        0% { opacity: 0.4; }
        50% { opacity: 0.85; }
        100% { opacity: 0.4; }
      }
      .report-skel-shimmer {
        animation: reportSkelShimmer 1.5s ease-in-out infinite;
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
      className="report-skel-shimmer"
      style={{
        height,
        width,
        borderRadius,
        backgroundColor: 'var(--border-color)',
        ...style,
      }}
    />
  );

  if (variant === 'detail') {
    return (
      <>
        <Styles />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
          <SkeletonBlock height="70px" borderRadius="14px" />
          <SkeletonBlock height="100px" borderRadius="14px" />
          <SkeletonBlock height="80px" borderRadius="14px" />
        </div>
      </>
    );
  }

  // Reasons skeleton (default) - Optimized with touch-friendly spacing
  return (
    <>
      <Styles />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '14px 16px',
              borderRadius: '14px',
              border: '1.5px solid var(--border-color)',
              backgroundColor: 'var(--bg-input)',
              minHeight: '52px',
            }}
          >
            <SkeletonBlock
              height="22px"
              width="22px"
              borderRadius="50%"
              style={{ flexShrink: 0 }}
            />
            <SkeletonBlock
              height="14px"
              width={`${50 + ((i * 7) % 40)}%`}
              borderRadius="6px"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default ReportSkeleton;