interface AdminCommunitySkeletonProps {
  count?: number;
}

const AdminCommunitySkeleton = ({
  count = 4,
}: AdminCommunitySkeletonProps) => {
  const shimmerBg = 'rgba(128,128,128,0.08)';

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '1rem 1.25rem',
            marginBottom: '0.75rem',
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '4px',
              alignSelf: 'stretch',
              borderRadius: '4px',
              backgroundColor: shimmerBg,
            }}
          />

          <div style={{ flex: 1 }}>
            <div
              style={{
                display: 'flex',
                gap: '6px',
                marginBottom: '10px',
              }}
            >
              {[60, 70].map((w, j) => (
                <div
                  key={j}
                  style={{
                    width: `${w}px`,
                    height: '18px',
                    borderRadius: '12px',
                    backgroundColor: shimmerBg,
                    animation: 'adminCommSkeleton 1.6s ease-in-out infinite',
                  }}
                />
              ))}
            </div>

            <div
              style={{
                width: '75%',
                height: '14px',
                borderRadius: '6px',
                backgroundColor: shimmerBg,
                marginBottom: '8px',
                animation: 'adminCommSkeleton 1.6s ease-in-out infinite',
              }}
            />

            <div
              style={{
                width: '50%',
                height: '10px',
                borderRadius: '6px',
                backgroundColor: shimmerBg,
                animation: 'adminCommSkeleton 1.6s ease-in-out infinite',
              }}
            />
          </div>

          <div
            style={{
              width: '70px',
              height: '28px',
              borderRadius: '24px',
              backgroundColor: shimmerBg,
              animation: 'adminCommSkeleton 1.6s ease-in-out infinite',
            }}
          />
        </div>
      ))}

      <style>{`
        @keyframes adminCommSkeleton {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default AdminCommunitySkeleton;